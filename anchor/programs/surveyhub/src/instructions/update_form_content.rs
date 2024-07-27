use crate::errors::ErrorCode;
use crate::schema::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id: String, new_content: String)]
pub struct UpdateFormContent<'info> {
    #[account(mut,
        seeds = [id.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = form.get_current_size() + (new_content.len() - form.get_current_content_len()),
        realloc::payer = system,
        realloc::zero = false)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub system: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn exec(
    ctx: Context<UpdateFormContent>,
    _id: String,
    new_content: String
) -> Result<()> {
    let form = &mut ctx.accounts.form;
    // Kiểm tra quyền sở hữu form
    if form.owner != ctx.accounts.owner.key() {
        return Err(ErrorCode::Unauthorized.into());
    }

    // Kiểm tra xem form đã được xuất bản chưa
    if form.published {
        return Err(ErrorCode::FormCannotBeEdited.into());
    }

    form.content = new_content;

    Ok(())
}
