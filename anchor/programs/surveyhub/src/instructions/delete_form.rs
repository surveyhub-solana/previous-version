use crate::schema::*;
use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;

#[derive(Accounts)]
pub struct DeleteForm<'info> {
    #[account(mut, close = system)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub system: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn exec(ctx: Context<DeleteForm>) -> Result<()> {
    let form = &mut ctx.accounts.form;
    if form.owner != ctx.accounts.owner.key() {
        return Err(ErrorCode::Unauthorized.into());
    }
    if form.remain_sol > 0 {
        let amount_lamports = ctx.accounts.form.remain_sol;
        // Kiểm tra số dư của system
        let system_balance = ctx.accounts.system.to_account_info().lamports();
        if system_balance < amount_lamports {
            return Err(ErrorCode::UnavailableBalance.into());
        }

        // Thực hiện chuyển SOL từ author qua system
        let transfer_instruction = system_instruction::transfer(
            &ctx.accounts.system.key(),
            &ctx.accounts.owner.key(),
            amount_lamports,
        );

        let result = invoke(
            &transfer_instruction,
            &[
                ctx.accounts.system.to_account_info(),
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        );

        match result {
            Ok(_) => {
                return Ok(());
            }
            Err(err) => {
                msg!("Failed to transfer SOL: {:?}", err);
                return Err(ErrorCode::TransferFailed.into())
            }
        }
    }
    else {
        Ok(())
    }
}
