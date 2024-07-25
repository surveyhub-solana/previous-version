use crate::errors::ErrorCode;
use crate::schema::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct PublishForm<'info> {
    #[account(mut)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

pub fn exec(ctx: Context<PublishForm>) -> Result<()> {
    let form = &mut ctx.accounts.form;
    // Kiểm tra quyền sở hữu form
    if form.owner != *ctx.accounts.owner.key {
        return Err(ErrorCode::Unauthorized.into());
    }
    form.published = true;
    Ok(())
}