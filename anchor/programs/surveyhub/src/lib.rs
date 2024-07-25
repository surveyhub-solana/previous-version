use anchor_lang::prelude::*;

pub mod errors;
pub use errors::ErrorCode;

pub mod schema;
pub use schema::*;

pub mod instructions;
pub use instructions::*;
declare_id!("269b8hnbGcCCTVc2GjMJmLi3fLVU3PYBZiSznb42b5eD");


#[program]
pub mod solana_program {
    use super::*;

    pub fn create_form(ctx: Context<CreateForm>, id: String) -> Result<()> {
        create_form::exec(ctx, id)
    }


    pub fn update_form_content(ctx: Context<UpdateFormContent>, _id: String, new_content: String) -> Result<()> {
        update_form_content::exec(ctx, _id, new_content)
    }

    pub fn update_form_sol(ctx: Context<UpdateFormSOL>, sum_sol: f64, sol_per_user: f64) -> Result<()> {
        update_form_sol::exec(ctx, sum_sol, sol_per_user)
    }

    pub fn publish_form(ctx: Context<PublishForm>) -> Result<()> {
        publish_form::exec(ctx)
    }

    pub fn submit_form(ctx: Context<SubmitForm>, content: String) -> Result<()> {
        submit_form::exec(ctx, content)
    }

}





