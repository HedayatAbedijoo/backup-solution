use bip0039::{Count, Mnemonic};

use magic_crypt::{new_magic_crypt, MagicCryptTrait};
pub fn mnemonic() -> String {
    let mnemonic = Mnemonic::generate(Count::Words12);

    let phrase = mnemonic.phrase();

    phrase.to_string()
}

fn encrypt(pass_pharase: String, message: String) -> String {
    let mc = new_magic_crypt!(pass_pharase, 256);

    mc.encrypt_str_to_base64(message)
}

fn decrypt(pass_pharase: String, encrypted: String) -> String {
    let mc = new_magic_crypt!(pass_pharase, 256);

    mc.decrypt_base64_to_string(&encrypted).unwrap()
}

pub fn hash(val: String) -> String {
    let result = hdk::prelude::hdi::hash::hash_sha3(val.as_bytes().to_vec()).unwrap();
    std::str::from_utf8(&result).unwrap().to_string()
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
