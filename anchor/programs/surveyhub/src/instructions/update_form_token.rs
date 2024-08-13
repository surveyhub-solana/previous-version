use crate::errors::ErrorCode;
use crate::schema::*;
use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

#[derive(Accounts)]
pub struct UpdateFormToken<'info> {
    #[account(mut)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub system: Signer<'info>,
    pub mint: Box<Account<'info, token::Mint>>,
    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = system
    )]
    pub system_token_account: Account<'info, token::TokenAccount>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner
    )]
    pub owner_token_account: Account<'info, token::TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn exec(
    ctx: Context<UpdateFormToken>,
    sum_sol: f64,
    sol_per_user: f64
) -> Result<()> {
    let form = &mut ctx.accounts.form;
    // Kiểm tra quyền sở hữu form
    if form.owner != ctx.accounts.owner.key() {
        return Err(ErrorCode::Unauthorized.into());
    }

    // Kiểm tra số dư token
    if (ctx.accounts.owner_token_account.amount as f64) < sum_sol {
        return Err(ErrorCode::UnavailableBalance.into());
    }
    let amount_tokens = (sum_sol * 1_000_000_000.0) as u64;
    // Logic chuyển token
    let cpi_accounts = token::Transfer {
        from: ctx.accounts.owner_token_account.to_account_info(),
        to: ctx.accounts.system_token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);

    // Thực hiện chuyển token
    token::transfer(cpi_ctx, amount_tokens)?;

    // Cập nhật form với thông tin mới
    form.mint = Some(ctx.accounts.mint.key());
    form.sum_sol = sum_sol;
    form.remain_sol = sum_sol;
    form.sol_per_user = sol_per_user;

    Ok(())
}
