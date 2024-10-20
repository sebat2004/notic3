import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

// Function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export const useUploadFile = () => {
    const [key, setKey] = useState<CryptoKey | null>(null);
    const [iv, setIv] = useState<Uint8Array>(new Uint8Array(12));
    const [regularKey, setRegularKey] = useState<string | null>(null);

    useEffect(() => {
        const newKey = crypto.getRandomValues(new Uint8Array(32));
        const keyString = Array.from(newKey)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        setRegularKey(keyString);

        crypto.subtle
            .importKey('raw', newKey, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
            .then((importedKey) => {
                setKey(importedKey);
            });

        const newIv = crypto.getRandomValues(new Uint8Array(12));
        setIv(newIv);
    }, []);

    const encryptFile = useCallback(
        async (file: File): Promise<ArrayBuffer> => {
            if (!key) {
                throw new Error('Encryption key not initialized');
            }

            const fileData = await file.arrayBuffer();
            return crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                },
                key,
                fileData
            );
        },
        [key, iv]
    );

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const encryptedFile = await encryptFile(file);
            const base64EncryptedFile = arrayBufferToBase64(encryptedFile);
            const response = await fetch(
                `https://walrus-testnet-publisher.nodes.guru/v1/store?epochs=5`,
                {
                    method: 'PUT',
                    body: base64EncryptedFile,
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            const result = await response.json();
            return result;
        },
    });

    return {
        uploadFile: uploadMutation.mutate,
        uploadFileAsync: uploadMutation.mutateAsync,
        uploadError: uploadMutation.error,
        encryptionKey: regularKey,
        encryptionIv: Array.from(iv)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(''),
    };
};
