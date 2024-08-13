use crate::schema::*;
use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

#[derive(Accounts)]
#[instruction(content: String, id: String)]
pub struct SubmitFormToken<'info> {
    #[account(mut)]
    pub form: Account<'info, Form>,
    #[account(init, seeds = [id.as_bytes(), author.key().as_ref()],
        bump, payer = system, space = 8 + 4 + id.len() + 32 + 32 + 8 + 4 + content.len())]
    pub form_submission: Account<'info, FormSubmissions>,
    #[account(mut)]
    pub author: Signer<'info>,
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
        associated_token::authority = author,
        constraint = form.mint.is_some()
    )]
    pub author_token_account: Account<'info, token::TokenAccount>,
    pub system_program: Program<'info, System>, // Thêm trường này
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn exec(ctx: Context<SubmitFormToken>, content: String, id: String) -> Result<()> {
    let form_submission = &mut ctx.accounts.form_submission;
    form_submission.author = ctx.accounts.author.key();
    form_submission.id = id;
    form_submission.created_at = Clock::get()?.unix_timestamp;
    form_submission.form_id = ctx.accounts.form.key();
    form_submission.content = content;

    ctx.accounts.form.submissions += 1;

    // Xử lý token nếu có mint
    let amount_tokens = (ctx.accounts.form.sol_per_user * 1_000_000_000.0) as u64;
    let system_token_account = &ctx.accounts.system_token_account;
    let author_token_account = &ctx.accounts.author_token_account;

    if system_token_account.amount < amount_tokens || ctx.accounts.form.remain_sol * 1_000_000_000.0 < amount_tokens as f64 {
        return Err(ErrorCode::UnavailableBalance.into());
    }

    let cpi_accounts = token::Transfer {
        from: system_token_account.to_account_info(),
        to: author_token_account.to_account_info(),
        authority: ctx.accounts.system.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);

    token::transfer(cpi_ctx, amount_tokens)?;

    ctx.accounts.form.remain_sol -= ctx.accounts.form.sol_per_user;

    Ok(())
}
