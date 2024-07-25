use anchor_lang::prelude::*;

#[account]
pub struct FormSubmissions {
    pub id: String, // 4 + 36
    pub author: Pubkey, // 32
    pub created_at: i64, // 8
    pub form_id: Pubkey, // 32
    pub content: String, // 4 + len()
}
