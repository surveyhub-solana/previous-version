use crate::schema::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct VisitForm<'info> {
    #[account(mut)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub system: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn exec(ctx: Context<VisitForm>) -> Result<()> {
    let form = &mut ctx.accounts.form;
    form.visits += 1;
    Ok(())
}
