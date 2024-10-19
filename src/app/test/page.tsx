'use client';

import { SuiClient } from '@mysten/sui/client';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { getWallets } from '@mysten/wallet-standard';

const Test = () => {
    const PACKAGE_ID = '0x9233592a81349d941e1804e684228d96a9f86203c3a52e66f14cc95b9f8b3edc';

    const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

    const wallets = getWallets().get();

    console.log(wallets);

    const tx = new Transaction();

    const [creatorSubscription] = tx.moveCall({
        target: `${PACKAGE_ID}::subscription::initialize`,
        arguments: [tx.pure.u64(100), tx.pure.u64(30 * 24 * 60 * 60 * 1000)],
    });

    // const res = await client.signAndExecuteTransaction({signer: keypair, transaction: tx })
    // await client.waitForTransaction({ digest: result.digest });

    return <div></div>;
};

export default Test;
