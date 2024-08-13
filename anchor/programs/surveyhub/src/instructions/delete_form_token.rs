use crate::schema::*;
use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

#[derive(Accounts)]
pub struct DeleteFormToken<'info> {
    #[account(mut, close = system)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub system: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = form.mint.unwrap(),
        associated_token::authority = system,
        constraint = form.mint.is_some()
    )]
    pub system_token_account: Account<'info, token::TokenAccount>,
    #[account(
        mut,
        associated_token::mint = form.mint.unwrap(),
        associated_token::authority = owner,
        constraint = form.mint.is_some()
    )]
    pub owner_token_account: Account<'info, token::TokenAccount>,
    pub system_program: Program<'info, System>, // Thêm trường này
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn exec(ctx: Context<DeleteFormToken>) -> Result<()> {
    let form = &mut ctx.accounts.form;
    if form.owner != ctx.accounts.owner.key() {
        return Err(ErrorCode::Unauthorized.into());
    }

    if form.remain_sol > 0.0 {
        // Trường hợp sử dụng token
        let amount_tokens = (form.remain_sol * 1_000_000_000.0) as u64;
        let system_token_account = &ctx.accounts.system_token_account;
        let owner_token_account = &ctx.accounts.owner_token_account;

        if system_token_account.amount < amount_tokens {
            return Err(ErrorCode::UnavailableBalance.into());
        }

        let cpi_accounts = token::Transfer {
            from: system_token_account.to_account_info(),
            to: owner_token_account.to_account_info(),
            authority: ctx.accounts.system.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);

        token::transfer(cpi_ctx, amount_tokens)?;
    }

    Ok(())
}
