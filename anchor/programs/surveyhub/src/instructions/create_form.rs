use crate::schema::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id: String)]
pub struct CreateForm<'info> {
    #[account(init, seeds = [id.as_bytes(), owner.key().as_ref()],
        bump, payer = owner, space = 8 + 4 + id.len() + 32 + 8 + 4 + 0 + 4 + 4 + 8 + 8 + 1)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn exec(ctx: Context<CreateForm>, id: String) -> Result<()> {
    let form = &mut ctx.accounts.form;
    form.id = id;
    form.owner = *ctx.accounts.owner.key;
    form.created_at = Clock::get()?.unix_timestamp;
    form.content = "".to_string();
    form.visits = 0;
    form.submissions = 0;
    form.sum_sol = 0.0;
    form.sol_per_user = 0.0;
    form.published = false;

    Ok(())
}
