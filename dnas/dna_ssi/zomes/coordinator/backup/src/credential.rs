use backup_integrity::*;
use hdk::prelude::*;

#[hdk_extern]
pub fn create_credential(credential: Credential) -> ExternResult<Record> {
    let credential_hash = create_entry(&EntryTypes::Credential(credential.clone()))?;

    let record = get(credential_hash.clone(), GetOptions::default())?.ok_or(wasm_error!(
        WasmErrorInner::Guest(String::from("Could not find the newly created Credential"))
    ))?;

    Ok(record)
}

#[hdk_extern]
pub fn get_credential(action_hash: ActionHash) -> ExternResult<Option<Record>> {
    get(action_hash, GetOptions::default())
}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateCredentialInput {
    original_action_hash: ActionHash,
    updated_credential: Credential,
}

#[hdk_extern]
pub fn update_credential(input: UpdateCredentialInput) -> ExternResult<Record> {
    let updated_credential_hash =
        update_entry(input.original_action_hash, &input.updated_credential)?;

    let record =
        get(updated_credential_hash.clone(), GetOptions::default())?.ok_or(wasm_error!(
            WasmErrorInner::Guest(String::from("Could not find the newly updated Credential"))
        ))?;

    Ok(record)
}
#[hdk_extern]
pub fn delete_credential(action_hash: ActionHash) -> ExternResult<ActionHash> {
    delete_entry(action_hash)
}
