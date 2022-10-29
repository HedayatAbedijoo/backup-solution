use hdi::prelude::*;
#[hdk_entry_helper]
#[derive(Clone)]
pub struct Credential {
    pub value: String,
}
