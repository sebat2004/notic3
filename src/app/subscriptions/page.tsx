'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const SUBSCRIPTION_TYPE =
    '0x9233592a81349d941e1804e684228d96a9f86203c3a52e66f14cc95b9f8b3edc::subscription::Subscription';

function Subscriptions() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const [creatorSubscriptions, setCreatorSubscriptions] = useState<SuiObjectResponse[]>([]);
    const [userSubscriptions, setUserSubscriptions] = useState<SuiObjectResponse[]>([]);

    useEffect(() => {
        if (account) {
            fetchOwnedObjects(account.address);
            fetchCreatorSubscriptions();
        }
    }, [account]);

    const fetchCreatorSubscriptions = async () => {
        const ids: string[] = [];
        userSubscriptions.forEach((objectResponse) => {
            if (objectResponse.data?.objectId) ids.push(objectResponse.data?.objectId);
        });
        const objResponse = await suiClient.multiGetObjects({ ids });

        console.log(objResponse);
        setCreatorSubscriptions(objResponse);
    };

    const fetchOwnedObjects = async (address: string) => {
        const { data } = await suiClient.getOwnedObjects({
            owner: address,
            options: {
                showType: true,
                showContent: true,
                showOwner: true,
            },
            filter: {
                StructType: SUBSCRIPTION_TYPE,
            },
        });

        console.log(data);
        setUserSubscriptions(data);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="flex">
                {creatorSubscriptions.map((object) => (
                    <Card key={object.data?.objectId}>
                        <CardHeader>
                            <CardTitle>{object.data?.content?.fields}</CardTitle>
                            <CardDescription>Expiring in x days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a
                                href={`https://suiscan.xyz/testnet/object/${object.data?.objectId}`}
                                target="_blank"
                            >
                                {object.data?.objectId}
                            </a>
                        </CardContent>
                        <CardFooter>
                            <p>Card Footer</p>
                        </CardFooter>
                    </Card>
                ))}
                ;
            </div>
        </div>
    );
}

export default Subscriptions;
