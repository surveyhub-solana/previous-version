use anchor_lang::prelude::*;

pub mod errors;
pub use errors::ErrorCode;

pub mod schema;
pub use schema::*;

pub mod instructions;
pub use instructions::*;
declare_id!("Dzz1hUHAkAFuMSm7qqmSPic4ucVpXNZjoov1WvFRmCCL");


#[program]
pub mod solana_program {
    use super::*;

    pub fn create_form(ctx: Context<CreateForm>, id: String, name: String, description: String) -> Result<()> {
        create_form::exec(ctx, id, name, description)
    }


    pub fn update_form_content(ctx: Context<UpdateFormContent>, _id: String, new_content: String) -> Result<()> {
        update_form_content::exec(ctx, _id, new_content)
    }

    pub fn update_form_sol(ctx: Context<UpdateFormSOL>, sum_sol: f64, sol_per_user: f64) -> Result<()> {
        update_form_sol::exec(ctx, sum_sol, sol_per_user)
    }
    pub fn update_form_token(ctx: Context<UpdateFormToken>, sum_sol: f64, sol_per_user: f64) -> Result<()> {
        update_form_token::exec(ctx, sum_sol, sol_per_user)
    }

    pub fn publish_form(ctx: Context<PublishForm>) -> Result<()> {
        publish_form::exec(ctx)
    }

    pub fn submit_form(ctx: Context<SubmitForm>, content: String, submission_id: String) -> Result<()> {
        submit_form::exec(ctx, content, submission_id)
    }
    pub fn submit_form_token(ctx: Context<SubmitFormToken>, content: String, submission_id: String) -> Result<()> {
        submit_form_token::exec(ctx, content, submission_id)
    }
    pub fn delete_form(ctx: Context<DeleteForm>) -> Result<()> {
        delete_form::exec(ctx)
    }
    pub fn delete_form_token(ctx: Context<DeleteFormToken>) -> Result<()> {
        delete_form_token::exec(ctx)
    }
    pub fn visit_form(ctx: Context<VisitForm>) -> Result<()> {
        visit_form::exec(ctx)
    }
}





