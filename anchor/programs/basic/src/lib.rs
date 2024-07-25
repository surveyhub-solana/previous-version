use anchor_lang::prelude::*;

declare_id!("269b8hnbGcCCTVc2GjMJmLi3fLVU3PYBZiSznb42b5eD");

#[program]
pub mod basic {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
