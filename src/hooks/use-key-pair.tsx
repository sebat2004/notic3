import { useQuery } from '@tanstack/react-query';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const KEYPAIR_STORAGE_KEY = 'notic3-secretkey';

const fetchKeyPair = () => {
    const secretKey = localStorage.getItem(KEYPAIR_STORAGE_KEY);

    if (secretKey) return Ed25519Keypair.fromSecretKey(secretKey);

    const keyPair = new Ed25519Keypair();

    localStorage.setItem(KEYPAIR_STORAGE_KEY, keyPair.getSecretKey());

    return keyPair;
};

export const useKeyPair = () => {
    return useQuery({
        queryKey: ['keypair'],
        queryFn: () => fetchKeyPair(),
    });
};
