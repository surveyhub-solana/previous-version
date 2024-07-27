use crate::errors::ErrorCode;
use crate::schema::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;

#[derive(Accounts)]
pub struct UpdateFormSOL<'info> {
    #[account(mut)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub system: Signer<'info>,
    pub system_program: Program<'info, System>,

}
pub fn exec(ctx: Context<UpdateFormSOL>, sum_sol: f64, sol_per_user: f64) -> Result<()> {
    let form = &mut ctx.accounts.form;

    // Kiểm tra quyền sở hữu form
    if form.owner != ctx.accounts.owner.key() {
        return Err(ErrorCode::Unauthorized.into());
    }

    // Chuyển đổi từ SOL sang lamports
    let amount_lamports = (sum_sol * 1_000_000_000.0) as u64;
    // Kiểm tra số dư của owner
    let owner_balance = ctx.accounts.owner.to_account_info().lamports();
    if owner_balance < amount_lamports {
        return Err(ErrorCode::UnavailableBalance.into());
    }
    // Thực hiện chuyển SOL từ author qua system
    let transfer_instruction = system_instruction::transfer(
        &ctx.accounts.owner.key(),
        &ctx.accounts.system.key(),
        amount_lamports,
    );

    let result = invoke(
        &transfer_instruction,
        &[
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.system.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    );

    match result {
        Ok(_) => {
            form.sum_sol = sum_sol;
            form.remain_sol = sum_sol;
            form.sol_per_user = sol_per_user;
            return Ok(())
        }
        Err(err) => {
            msg!("Failed to transfer SOL: {:?}", err);
            return Err(ErrorCode::TransferFailed.into())
        }
    }
}