import { useMutation } from '@tanstack/react-query';

//because of the weird shit of base64 encoding a key we already have the localstorage key is setup as a base64 binary and from there if u want it as a string 
//you would use byte string, i have something set up like this in the page.tsx in the create page because I was trying to setup 
//some downloads things so the user can just copy and paste it
 
export const useEncryptKey = (localStorageKey: string) => {
  return useMutation({
    mutationFn: async (keyToEncrypt: string) => {
      const pubKeyString = localStorage.getItem(localStorageKey);
      if (!pubKeyString) {
        throw new Error(`Public key not found in localStorage for key: ${localStorageKey}`);
      }

      try {
        // Decode the base64 public key
        const pubKeyBuffer = Uint8Array.from(atob(pubKeyString), c => c.charCodeAt(0));

        // Import the public key
        const importedKey = await window.crypto.subtle.importKey(
          'spki',
          pubKeyBuffer,
          { name: 'RSA-OAEP', hash: 'SHA-256' },
          true,
          ['encrypt']
        );

        // Encrypt the key
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