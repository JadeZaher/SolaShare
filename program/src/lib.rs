use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Post {
    pub author: Pubkey,
    pub content: String,
    pub timestamp: u64,
    pub image_url: Option<String>,
}

// Instruction types
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum PostInstruction {
    CreatePost {
        content: String,
        image_url: Option<String>,
    },
}

// Program entrypoint
entrypoint!(process_instruction);

// Program logic
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = PostInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        PostInstruction::CreatePost { content, image_url } => {
            msg!("Instruction: CreatePost");
            process_create_post(program_id, accounts, content, image_url)
        }
    }
}

fn process_create_post(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    content: String,
    image_url: Option<String>,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    // Get accounts
    let post_account = next_account_info(account_info_iter)?;
    let author = next_account_info(account_info_iter)?;

    // Ensure the post account is owned by our program
    if post_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Ensure the author signed the transaction
    if !author.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Create and serialize the post
    let post = Post {
        author: *author.key,
        content,
        timestamp: solana_program::clock::Clock::get()?.unix_timestamp as u64,
        image_url,
    };

    post.serialize(&mut *post_account.data.borrow_mut())?;

    msg!("Post created successfully");
    Ok(())
}
