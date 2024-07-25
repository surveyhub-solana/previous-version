use crate::schema::*;
use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
use uuid::Uuid;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;

#[derive(Accounts)]
#[instruction(id: String, content: String)]
pub struct SubmitForm<'info> {
    #[account(mut)]
    pub form: Account<'info, Form>,
    #[account(init, payer = system, space = 8 + 4 + 36 + 32 + 8 + 32 + 4 + content.len())]
    pub form_submission: Account<'info, FormSubmissions>,
    pub author: AccountInfo<'info>,
    #[account(mut)]
    pub system: Signer<'info>,
    pub system_program: Program<'info, System>,
}

 pub fn exec(ctx: Context<SubmitForm>, content: String) -> Result<()> {
    let form_submission = &mut ctx.accounts.form_submission;
    form_submission.author = *ctx.accounts.author.key;
    form_submission.id = Uuid::new_v4().to_string();
    form_submission.created_at = Clock::get()?.unix_timestamp;
    form_submission.form_id = ctx.accounts.form.key();
    form_submission.content = content;

    ctx.accounts.form.submissions += 1;
    // Chuyển đổi từ SOL sang lamports
    let amount_lamports = (ctx.accounts.form.sol_per_user * 1_000_000_000.0) as u64;
    // Thực hiện chuyển SOL từ author qua system
    let transfer_instruction = system_instruction::transfer(
        &ctx.accounts.system.key(),
        &ctx.accounts.author.key(),
        amount_lamports,
    );

    let result = invoke(
        &transfer_instruction,
        &[
            ctx.accounts.system.to_account_info(),
            ctx.accounts.author.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    );

    match result {
        Ok(_) => {
            return Ok(())
        }
        Err(err) => {
            msg!("Failed to transfer SOL: {:?}", err);
            return Err(ErrorCode::TransferFailed.into())
        }
    }
}