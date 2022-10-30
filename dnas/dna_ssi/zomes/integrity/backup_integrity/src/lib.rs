pub mod credential;
pub use credential::*;
use hdi::prelude::*;
#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
    Ok(ValidateCallbackResult::Valid)
}
#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
    Credential(Credential),
}
#[hdk_link_types]
pub enum LinkTypes {
    MyCredentialData,
}
