'use client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/zklogin';
import { SuiClient } from '@mysten/sui/client';

const FULLNODE_URL = 'https://fullnode.testnet.sui.io'; // replace with the RPC URL you want to use

export default async function Login() {
    const suiClient = new SuiClient({ url: FULLNODE_URL });
    const { epoch, epochDurationMs, epochStartTimestampMs } =
        await suiClient.getLatestSuiSystemState();

    const maxEpoch = Number(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

    const REDIRECT_URI = 'http://localhost:3000'; // Replace with prod url eventually
    const CLIENT_ID = '1034945406915-16vf68vkpro1369va4qcg3u68a7imnv5.apps.googleusercontent.com';
    const res = () =>
        window.location.replace(
            `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URI}&scope=openid&nonce=${nonce}`
        );
    return (
        <button className="h-10 w-10 rounded-md" onClick={res}>
            Locked In
        </button>
    );
}
