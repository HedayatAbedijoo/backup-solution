#![allow(dead_code)]

pub mod credential;
use hdk::prelude::*;
pub mod utility;

#[hdk_extern]
pub fn init(_: ()) -> ExternResult<InitCallbackResult> {
    Ok(InitCallbackResult::Pass)
}

#[hdk_extern]
fn mnemonic(_: ()) -> ExternResult<String> {
    Ok(crate::utility::mnemonic())
}
