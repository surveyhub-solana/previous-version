use crate::schema::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id: String, name: String, description: String)]
pub struct CreateForm<'info> {
    #[account(init, seeds = [id.as_bytes(), owner.key().as_ref()],
        bump, payer = system, space = 8 + 4 + id.len() + 32 + 32 + 4 + name.len() + 4 + description.len() + 8 + 4 + 2 + 4 + 4 + 8 + 8 + 8 + 1 + 1 + 32)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub system: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn exec(ctx: Context<CreateForm>, id: String, name: String, description: String) -> Result<()> {
    let form = &mut ctx.accounts.form;
    form.id = id;
    form.system = ctx.accounts.system.key();
    form.owner = ctx.accounts.owner.key();
    form.name = name;
    form.description = description;
    form.created_at = Clock::get()?.unix_timestamp;
    form.content = "[]".to_string();
    form.visits = 0;
    form.submissions = 0;
    form.sum_sol = 0.0;
    form.remain_sol = 0.0;
    form.sol_per_user = 0.0;
    form.published = false;

    Ok(())
}
