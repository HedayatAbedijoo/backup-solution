use backup_integrity::*;
use hdk::prelude::*;

use crate::utility;

//DTO object to send data from UI to Conductor
//#[hdk_entry_helper]
//#[derive(Clone)]

#[derive(Clone, Serialize, Deserialize, Debug, SerializedBytes)]
pub struct CredentialDTO {
    pub value: String,
    pub pass_phrase: String,
}

#[hdk_extern]
pub fn get_hash(credential: Credential) -> ExternResult<String> {
    // let blake_hash = hdk::hash::hash_blake2b(credential.value.as_bytes().to_vec(), 36)?;
    //str::from_utf8(blake_hash)
    //let result = std::str::from_utf8(&blake_hash).unwrap().to_string();
    // let result = hdk::prelude::hdi::hash::hash_sha3(credential.value.as_bytes().to_vec()).unwrap();
    // let _ss = std::str::from_utf8(&result).unwrap().to_string();
    //  let ss: String = result.into();
    // let ssss = String::from_utf8(result);

    Ok(utility::get_hash(credential.value))
}

#[hdk_extern]
pub fn create_credential2(credential: CredentialDTO) -> ExternResult<Record> {
    let networkid = utility::get_hash(credential.pass_phrase.clone());
    let newcredential = Credential {
        value: credential.value,
    };
    let credential_hash = create_entry(&EntryTypes::Credential(newcredential))?;

    let record = get(credential_hash.clone(), GetOptions::default())?.ok_or(wasm_error!(
        WasmErrorInner::Guest(String::from("Could not find the newly created Credential"))
    ))?;

    create_link(
        hash_doi(networkid)?,
        credential_hash.clone(),
        LinkTypes::MyCredentialData,
        (),
    )?;
    Ok(record)
}

// Create new credentail
#[hdk_extern]
pub fn create_credential(credential: CredentialDTO) -> ExternResult<Record> {
    let networkid = utility::get_hash(credential.pass_phrase.clone());
    //let _from = hash_doi(networkid);
    let encrypted = utility::encrypt(credential.pass_phrase.clone(), credential.value);
    let newcredential = Credential { value: encrypted };

    let credential_hash = create_entry(&EntryTypes::Credential(newcredential))?;

    let record = get(credential_hash.clone(), GetOptions::default())?.ok_or(wasm_error!(
        WasmErrorInner::Guest(String::from("Could not find the newly created Credential"))
    ))?;

    create_link(
        hash_doi(networkid)?,
        credential_hash.clone(),
        LinkTypes::MyCredentialData,
        (),
    )?;
    Ok(record)
}

// helper function to convert string to a Hash compatible with Holochain for Link
fn hash_doi(doi: String) -> ExternResult<EntryHash> {
    let blake_hash = hdk::hash::hash_blake2b(doi.as_bytes().to_vec(), 36)?;
    Ok(EntryHash::from_raw_36(blake_hash))
}

#[derive(Clone, Serialize, Deserialize, Debug, SerializedBytes)]
pub struct PhraseDTO {
    pub pass_phrase: String,
}
//Get my data with my pass_phrase
#[hdk_extern]
pub fn get_all_data(phrase: PhraseDTO) -> ExternResult<Vec<Credential>> {
    let networkid = utility::get_hash(phrase.pass_phrase.clone());
    let links = get_links(
        hash_doi(networkid.clone())?,
        LinkTypes::MyCredentialData,
        None,
    )?;
    let get_input: Vec<GetInput> = links
        .into_iter()
        .map(|link| GetInput::new(ActionHash::from(link.target).into(), GetOptions::default()))
        .collect();
    let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;
    let records: Vec<Record> = maybe_records.into_iter().filter_map(|r| r).collect();
    let mut result: Vec<Credential> = vec![];

    for record in records {
        let entry: Credential = record.entry().to_app_option().unwrap().unwrap();
        result.push(Credential {
            value: utility::decrypt(phrase.pass_phrase.clone(), entry.value),
        });
    }

    Ok(result)
}

#[hdk_extern]
pub fn get_credential(action_hash: ActionHash) -> ExternResult<Option<Record>> {
    get(action_hash, GetOptions::default())
}

// we are not implementing Update/Delete Scenario

// #[derive(Serialize, Deserialize, Debug)]
// pub struct UpdateCredentialInput {
//     original_action_hash: ActionHash,
//     updated_credential: Credential,
// }

// #[hdk_extern]
// pub fn update_credential(input: UpdateCredentialInput) -> ExternResult<Record> {
//     let updated_credential_hash =
//         update_entry(input.original_action_hash, &input.updated_credential)?;

//     let record =
//         get(updated_credential_hash.clone(), GetOptions::default())?.ok_or(wasm_error!(
//             WasmErrorInner::Guest(String::from("Could not find the newly updated Credential"))
//         ))?;

//     Ok(record)
// }
// #[hdk_extern]
// pub fn delete_credential(action_hash: ActionHash) -> ExternResult<ActionHash> {
//     delete_entry(action_hash)
// }
