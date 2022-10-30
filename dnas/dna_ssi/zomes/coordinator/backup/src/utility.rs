use bip0039::{Count, Mnemonic};
use magic_crypt::{new_magic_crypt, MagicCryptTrait};
use sha2::{Digest, Sha256};

pub fn mnemonic() -> String {
    let mnemonic = Mnemonic::generate(Count::Words12);

    let phrase = mnemonic.phrase();

    phrase.to_string()
}

pub fn encrypt(pass_pharase: String, message: String) -> String {
    let mc = new_magic_crypt!(pass_pharase, 256);

    mc.encrypt_str_to_base64(message)
}

pub fn decrypt(pass_pharase: String, encrypted: String) -> String {
    let mc = new_magic_crypt!(pass_pharase, 256);

    mc.decrypt_base64_to_string(&encrypted).unwrap()
}

pub fn hash(val: String) -> String {
    // let result = hdk::prelude::hdi::hash::hash_sha3(val.as_bytes().to_vec()).unwrap();
    // std::str::from_utf8(&result).unwrap().to_string()
    let blake_hash = hdk::hash::hash_blake2b(val.as_bytes().to_vec(), 36).unwrap();
    //str::from_utf8(blake_hash)
    std::str::from_utf8(&blake_hash).unwrap().to_string()
}

pub fn get_hash(val: String) -> String {
    //  create a Sha256 object
    let mut hasher = Sha256::new();
    // write input message
    hasher.update(val);
    // read hash digest and consume hasher
    let hash = hasher.finalize();
    format!("{:x}", hash)
}

#[cfg(test)]
mod encryption_test {
    use super::*;
    #[test]
    fn encryption_works() {
        let source = "Hi there".to_string();
        let encrypted = encrypt("pass_pharase".to_string(), source.clone());
        let decrypted = decrypt("pass_pharase".to_string(), encrypted);
        assert_eq!(decrypted, source);
    }
}
