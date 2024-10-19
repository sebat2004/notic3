import { useMutation } from '@tanstack/react-query';

// Function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Function to decrypt AES-GCM encrypted data
async function decryptData(
    encryptedData: ArrayBuffer,
    key: CryptoKey,
    iv: Uint8Array
): Promise<ArrayBuffer> {
    return await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encryptedData
    );
}

export const useDownloadFile = (key: CryptoKey, iv: Uint8Array) => {
    return useMutation({
        mutationFn: async (blobId: string) => {
            const response = await fetch(
                `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Download failed');
            }
            const base64EncryptedFile = await response.text();
            const encryptedArrayBuffer = base64ToArrayBuffer(base64EncryptedFile);

            // Decrypt the file
            const decryptedArrayBuffer = await decryptData(encryptedArrayBuffer, key, iv);

            console.log(
                'Downloaded and decrypted file',
                new Uint8Array(decryptedArrayBuffer).subarray(0, 100)
            );
            return decryptedArrayBuffer;
        },
    });
};
