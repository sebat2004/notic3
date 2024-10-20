import { useMutation } from '@tanstack/react-query';

export const useEncryptKey = (localStorageKey: string) => {
  return useMutation({
    mutationFn: async (keyToEncrypt) => {
      const pubKeyString = localStorage.getItem(localStorageKey);
      if (!pubKeyString) {
        throw new Error(`Public key not found in localStorage for key: ${localStorageKey}`);
      }

      try {
        // Decode the base64 public key
        const pubKeyBuffer = Uint8Array.from(atob(pubKeyString), c => c.charCodeAt(0));

        // Import the public key
        const importedKey = await crypto.subtle.importKey(
          'spki',
          pubKeyBuffer,
          { name: 'RSA-OAEP', hash: 'SHA-256' },
          true,
          ['encrypt']
        );

        // Encrypt the key
        const encryptedBuffer = await crypto.subtle.encrypt(
          { name: 'RSA-OAEP' },
          importedKey,
          new TextEncoder().encode(keyToEncrypt as string)
        );

        // Convert the encrypted buffer to a base64 string
        return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedBuffer))));
      } catch (error) {
        console.error('Encryption failed:', error);
        throw error;
      }
    },
  });
};