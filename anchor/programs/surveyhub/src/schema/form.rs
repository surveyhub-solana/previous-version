use anchor_lang::prelude::*;

#[account]
pub struct Form {
    pub id: String, // 4 + id.len()
    pub owner: Pubkey, // 32
    pub created_at: i64, // 8
    pub content: String, // 4 + len()
    pub visits: u32, // 4
    pub submissions: u32, // 4
    pub sum_sol: f64, // 8
    pub sol_per_user: f64, // 8
    pub published: bool // 1
}

