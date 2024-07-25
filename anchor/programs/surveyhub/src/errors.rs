use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid input data provided.")]
    InvalidInput, // 6000
    #[msg("Unauthorized action.")]
    Unauthorized, // 6001
    #[msg("This form cannot be edited.")]
    FormCannotBeEdited, // 6003
    #[msg("Failed to transfer SOL.")]
    TransferFailed, // 6004
    // Thêm các mã lỗi khác tại đây nếu cần
}
