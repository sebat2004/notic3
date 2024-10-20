import { useMutation } from '@tanstack/react-query';

export const useEncryptKey = () => {
    return useMutation({
        mutationFn: async (keyToEncrypt: string) => {
            const pubKeyString = localStorage.getItem('notic3-pubkey');
            if (!pubKeyString) {
                throw new Error('Public key not found in localStorage');
            }

            try {
                // Import the public key
                const importedKey = await importCryptoKey('public', pubKeyString);

                // Encrypt the key string
                const encryptedBuffer = await window.crypto.subtle.encrypt(
                    { name: 'RSA-OAEP' },
                    importedKey,
                    new TextEncoder().encode(keyToEncrypt)
                );

                // Convert the encrypted buffer to a base64 string
                return btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedBuffer)));
            } catch (error) {
                console.error('Encryption failed:', error);
                if (error instanceof DOMException) {
                    throw new Error(`Crypto operation failed: ${error.message}`);
                }
                throw error;
            }
        },
    });
};

// Helper function to import crypto key from base64
async function importCryptoKey(type: 'public' | 'private', keyData: string) {
    const binaryDer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

    return window.crypto.subtle.importKey(
        type === 'private' ? 'pkcs8' : 'spki',
        binaryDer.buffer,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        true,
        type === 'private' ? ['decrypt'] : ['encrypt']
    );
}
