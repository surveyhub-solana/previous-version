use crate::errors::ErrorCode;
use crate::schema::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id: String, new_content: String)]
pub struct UpdateFormContent<'info> {
    #[account(mut,
        seeds = [id.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + 4 + id.len() + 32 + 8 + 4 + new_content.len() + 4 + 4 + 8 + 8 + 1,
        realloc::payer = owner,
        realloc::zero = true)]
    pub form: Account<'info, Form>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn exec(ctx: Context<UpdateFormContent>, _id: String, new_content: String) -> Result<()> {
    let form = &mut ctx.accounts.form;

    // Kiểm tra quyền sở hữu form
    if form.owner != *ctx.accounts.owner.key {
        return Err(ErrorCode::Unauthorized.into());
    }

    // Ví dụ: form không thể sửa nếu đã được xuất bản
    if form.published {
        return Err(ErrorCode::FormCannotBeEdited.into());
    }

    form.content = new_content;

    Ok(())
}