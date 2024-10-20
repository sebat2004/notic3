'use client';

import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignTransaction, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

const Test = () => {
    const { mutateAsync: signTransaction } = useSignTransaction();
    const [signature, setSignature] = useState('');
    const [creatorSubscriptionId, setCreatorSubscriptionId] = useState<string | null>(null);
    const client = useSuiClient();
    const account = useCurrentAccount();

    const NEXT_PUBLIC_PACKAGE_ID =
        '0x45b40cab6aaafecbc4ddf0c17b5dd72e38115fdbf380e239c2becbd95ff12adc';
    const NEXT_PUBLIC_CREATOR_REGISTRY_ID =
        '0xf79b92569bd58e6c1edf9f650169ba83697aac2c047370252ef449162013208c';
    const NEXT_PUBLIC_CREATOR_SUBSCRIPTION_REGISTRY_ID =
        '0x09bdc71d7bd19f655a9570f55a47936569020b25b560c6fa5d41563c0470cb26';

    return (
        <div>
            {account && (
                <>
                    <div>
                        <button
                            onClick={async () => {
                                const tx = new Transaction();

                                tx.moveCall({
                                    target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::subscription::initialize`,
                                    arguments: [
                                        tx.object(
                                            process.env.NEXT_PUBLIC_CREATOR_SUBSCRIPTION_REGISTRY_ID
                                        ),
                                        tx.pure.u64(100),
                                        tx.pure.u64(30 * 24 * 60 * 60 * 1000),
                                    ],
                                });

                                const { bytes, signature, reportTransactionEffects } =
                                    await signTransaction({
                                        transaction: tx,
                                        chain: 'sui:testnet',
                                    });

                                setSignature(signature);

                                const executeResult = await client.executeTransactionBlock({
                                    transactionBlock: bytes,
                                    signature,
                                    options: {
                                        showRawEffects: true,
                                        showObjectChanges: true,
                                    },
                                });

                                const createdObject = executeResult.objectChanges?.find(
                                    (obj) => obj.type == 'created'
                                );
                                if (createdObject) setCreatorSubscriptionId(createdObject.objectId);

                                // Always report transaction effects to the wallet after execution
                                reportTransactionEffects(executeResult.rawEffects!);

                                console.log(executeResult);
                            }}
                        >
                            create sub
                        </button>
                        <button
                            onClick={async () => {
                                if (creatorSubscriptionId == null) return;
                                const tx = new Transaction();

                                tx.moveCall({
                                    target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::subscription::subscribe`,
                                    arguments: [tx.object(creatorSubscriptionId), tx.object('0x6')],
                                });
                                const { bytes, signature, reportTransactionEffects } =
                                    await signTransaction({
                                        transaction: tx,
                                        chain: 'sui:testnet',
                                    });

                                setSignature(signature);

                                const executeResult = await client.executeTransactionBlock({
                                    transactionBlock: bytes,
                                    signature,
                                    options: {
                                        showRawEffects: true,
                                    },
                                });

                                // Always report transaction effects to the wallet after execution
                                reportTransactionEffects(executeResult.rawEffects!);

                                console.log(executeResult);
                            }}
                        >
                            sub
                        </button>
                    </div>
                    <div>Signature: {signature}</div>
                </>
            )}
        </div>
    );
};

export default Test;
