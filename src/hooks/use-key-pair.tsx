import { useQuery } from '@tanstack/react-query';

// Function to export keys to base64
export async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        key.type === 'private' ? 'pkcs8' : 'spki', // 'spki' for public, 'pkcs8' for private
        key
    );
    const exportedAsString = new Uint8Array(exported);
    const base64String = btoa(String.fromCharCode(...exportedAsString));
    return base64String;
}

// Function to store the key pair in localStorage
async function storeKeyPairInLocalStorage(keyPair) {
    // Export the public key
    const publicKeyBase64 = await exportCryptoKey(keyPair.publicKey);
    // Export the private key
    const privateKeyBase64 = await exportCryptoKey(keyPair.privateKey);

    // Store both keys in localStorage
    localStorage.setItem('notic3-pubkey', publicKeyBase64);
    localStorage.setItem('notic3-privkey', privateKeyBase64);
}

// Function to import keys from base64 stored in localStorage
async function importCryptoKey(type, keyData) {
    const binaryDer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

    return window.crypto.subtle.importKey(
        type === 'private' ? 'pkcs8' : 'spki', // 'spki' for public, 'pkcs8' for private
        binaryDer.buffer,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        true, // Whether the key is extractable
        type === 'private' ? ['decrypt'] : ['encrypt'] // 'decrypt' for private key, 'encrypt' for public key
    );
}

// Function to load the key pair from localStorage
async function loadKeyPairFromLocalStorage() {
    const publicKeyBase64 = localStorage.getItem('publicKey');
    const privateKeyBase64 = localStorage.getItem('privateKey');

    if (publicKeyBase64 && privateKeyBase64) {
        const publicKey = await importCryptoKey('public', publicKeyBase64);
        const privateKey = await importCryptoKey('private', privateKeyBase64);

        return { publicKey, privateKey };
    } else {
        return null;
    }
}

const fetchKeyPair = async () => {
    const keys = await loadKeyPairFromLocalStorage();

    if (keys) {
        return {
            ...keys,
            rawPublicKey: await exportCryptoKey(keys.publicKey),
            rawPrivateKey: await exportCryptoKey(keys.privateKey),
        };
    }

    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
        },
        true, // Whether the key is extractable
        ['encrypt', 'decrypt'] // Key uses
    );

    storeKeyPairInLocalStorage(keyPair);

    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;

    const rawPublicKey = await exportCryptoKey(publicKey);
    const rawPrivateKey = await exportCryptoKey(privateKey);

    return { publicKey, privateKey, rawPublicKey, rawPrivateKey };
};

export const useKeyPair = () => {
    return useQuery({
        queryKey: ['keypair'],
        queryFn: () => fetchKeyPair(),
    });
};
