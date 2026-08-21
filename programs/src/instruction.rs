use crate::error::LaunchpadError;
use solana_program::program_error::ProgramError;

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LaunchpadInstruction {
    Initialize { seed: Vec<u8> },
    Configure,
    MoveToReview,
    Activate,
    Pause,
    Finalize,
}

impl LaunchpadInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        match input.first().copied() {
            Some(0) => {
                let len = *input.get(1).ok_or(LaunchpadError::InvalidInstruction)? as usize;
                if len == 0 || len > 32 || input.len() != len + 2 { return Err(LaunchpadError::InvalidInstruction.into()); }
                Ok(Self::Initialize { seed: input[2..].to_vec() })
            }
            Some(1) if input.len() == 1 => Ok(Self::Configure),
            Some(2) if input.len() == 1 => Ok(Self::MoveToReview),
            Some(3) if input.len() == 1 => Ok(Self::Activate),
            Some(4) if input.len() == 1 => Ok(Self::Pause),
            Some(5) if input.len() == 1 => Ok(Self::Finalize),
            _ => Err(LaunchpadError::InvalidInstruction.into()),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_trailing_bytes_for_fixed_instructions() {
        assert!(LaunchpadInstruction::unpack(&[3, 0]).is_err());
    }

    #[test]
    fn validates_initialize_seed_length() {
        assert!(LaunchpadInstruction::unpack(&[0, 0]).is_err());
        assert!(LaunchpadInstruction::unpack(&[0, 2, 1, 2]).is_ok());
        assert!(LaunchpadInstruction::unpack(&[0, 2, 1]).is_err());
    }
}
