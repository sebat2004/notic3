import { useMutation } from '@tanstack/react-query';

// Function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    console.log('arrayBufferToBase64', btoa(binary).substring(0, 100));
    return btoa(binary);
}

export const useUploadFile = () => {
    return useMutation({
        mutationFn: async (fileData: ArrayBuffer) => {
            const base64EncryptedFile = arrayBufferToBase64(fileData);
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
            return response.json();
        },
    });
};
