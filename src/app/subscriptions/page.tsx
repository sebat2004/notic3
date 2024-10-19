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


interface Subscription {
    creator_subscription_id: string;
    end_time: string;
    start_time: string;
}

type SubscriptionArray = Subscription[];

function Subscriptions() {

    const PACKAGE_ID = '0x993f1f7eee655c9c8bf383d3cfc155541a464149d531c9066853ac1ad1549126';
    const REGISTRY_ID = '0xcb2f1a519d9e2b8b3ff64a68803931143de2425b8ba3afd4726cd8de33eb8dab'

    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const [registry, setRegistry] = useState<SuiObjectResponse>();
    const [creatorSubscriptions, setCreatorSubscriptions] = useState<SuiObjectResponse[]>([]);
    const [userSubscriptions, setUserSubscriptions] = useState<SubscriptionArray>([]);

    useEffect(() => {
        if (account) {
            (async() => {
                const registryResp = await suiClient.getObject({
                    id: REGISTRY_ID,
                    options: {
                        showContent: true
                    }
                });
                setRegistry(registryResp)

                const creatorSubscriptionsResp = await suiClient.multiGetObjects({
                    ids: registryResp?.data?.content?.fields.subscriptions,
                    options: {
                        showContent: true
                    }
                })
                setCreatorSubscriptions(creatorSubscriptionsResp)

                console.log(creatorSubscriptionsResp)
                creatorSubscriptionsResp.forEach(creatorSubscription => {
                    creatorSubscription.data?.content?.fields.subscriptions.fields.contents.forEach(subscription => {
                        if (subscription.fields.key == account.address) {
                            console.log(subscription.fields.value.fields)
                            setUserSubscriptions(prevSubscriptions => {
                                const newSubscription: Subscription = {
                                    creator_subscription_id: subscription.fields.value.fields.creator_subscription_id,
                                    end_time: subscription.fields.value.fields.end_time,
                                    start_time: subscription.fields.value.fields.start_time
                                };
                                return [
                                    ...prevSubscriptions,
                                    newSubscription
                                ]
                            })
                        }
                    })
                })
            })();
        }
    }, [account]);

    console.log(userSubscriptions)


    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col">
                {userSubscriptions.map(subscription => (
                    <Card key={subscription.end_time}>
                        <CardHeader>
                            <CardTitle>{subscription.creator_subscription_id}</CardTitle>
                            <CardDescription>Expiring in x days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a href={`https://suiscan.xyz/testnet/object/${subscription}`} target="_blank">link</a>
                        </CardContent>
                        <CardFooter>
                            <p>Card Footer</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Subscriptions;
