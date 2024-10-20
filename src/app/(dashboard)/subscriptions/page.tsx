'use client';
import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/client';
import { useKeyPair } from '@/hooks/use-key-pair';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCreators } from '@/hooks/use-creators';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Navigation, SquareArrowOutUpRight } from 'lucide-react';

interface Subscription {
    creator_subscription_id: string;
    end_time: string;
    start_time: string;
    cost: string;
    title: string;
    creator_id: string;
    creator_name?: string;
    creator_blobId?: string;
}

type SubscriptionArray = Subscription[];

function Subscriptions() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const [registry, setRegistry] = useState<SuiObjectResponse>();
    const [creatorSubscriptions, setCreatorSubscriptions] = useState<SuiObjectResponse[]>([]);
    const [userSubscriptions, setUserSubscriptions] = useState<SubscriptionArray>([]);
    const creators = useCreators();

    const { data, isPending, isFetching } = useKeyPair();

    useEffect(() => {
        if (account) {
            fetchSubscriptionData();
        }
    }, [account]);

    const fetchSubscriptionData = async () => {
        try {
            const registryResp = await suiClient.getObject({
                id: process.env.NEXT_PUBLIC_CREATOR_SUBSCRIPTION_REGISTRY_ID,
                options: { showContent: true },
            });
            setRegistry(registryResp);

            const subscriptionResp = await suiClient.multiGetObjects({
                ids: registryResp?.data?.content?.fields.subscriptions,
                options: { showContent: true },
            });
            setCreatorSubscriptions(subscriptionResp);

            const userSubs = [];
            for (const creatorSubscription of subscriptionResp) {
                const contents =
                    creatorSubscription.data?.content?.fields.subscriptions.fields.contents;
                for (const subscription of contents) {
                    if (subscription.fields.key === account.address) {
                        const creatorSubResp = await suiClient.getObject({
                            id: subscription.fields.value.fields.creator_subscription_id,
                            options: { showContent: true },
                        });
                        console.log(creatorSubResp.data?.content?.fields);
                        userSubs.push({
                            creator_subscription_id:
                                subscription.fields.value.fields.creator_subscription_id,
                            end_time: subscription.fields.value.fields.end_time,
                            start_time: subscription.fields.value.fields.start_time,
                            cost: creatorSubResp.data?.content?.fields.subscription_price,
                            creator_id: creatorSubResp.data?.content?.fields.creator,
                            title: creatorSubResp.data?.content?.fields.title,
                        });
                    }
                }
            }
            setUserSubscriptions(userSubs);
        } catch (error) {
            console.error('Error fetching subscription data:', error);
        }
    };

    const calculateTimeLeft = (endTime) => {
        const timestamp = parseInt(endTime, 10);
        const difference = timestamp - Date.now();
        const seconds = Math.floor(Math.abs(difference) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    };

    if (!account) {
        return (
            <Alert className="m-4 text-4xl">
                <AlertTitle>No Account Found</AlertTitle>
                <AlertDescription>
                    Please connect your wallet to view your subscriptions.
                </AlertDescription>
            </Alert>
        );
    }

    console.log(userSubscriptions);
    const allIds = userSubscriptions.map((sub) => sub.creator_subscription_id);
    const userSubscriptionsWithInfo = [] as Subscription[];

    creators.forEach((creator) => {
        // Find the creator subscription and add it to the userSubscriptionsWithInfo array
        console.log(creator);
        const subscription = userSubscriptions.find((sub) => sub.creator_id === creator.address);
        console.log(userSubscriptions);
        if (subscription) {
            console.log(creator);
            userSubscriptionsWithInfo.push({
                ...subscription,
                creator_name: creator.name,
                creator_blobId: creator.image,
            });
        }
    });
    console.log(userSubscriptionsWithInfo);

    return (
        <div className="flex w-full flex-col items-center justify-start gap-10 p-10">
            <h1 className="text-2xl font-bold">Your Subscriptions</h1>
            <div className="flex flex-col">
                {userSubscriptionsWithInfo.map((subscription) => (
                    <Card key={subscription.end_time}>
                        <CardHeader>
                            <CardTitle>
                                {subscription.creator_name}'s {subscription.title} Subscription
                            </CardTitle>
                            <CardDescription>
                                <div className="flex flex-col gap-2">
                                    <h2>{subscription.creator_subscription_id}</h2>
                                    <h2>Expiring in {calculateTimeLeft(subscription.end_time)}</h2>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <a
                                    href={`https://suiscan.xyz/testnet/object/${subscription.creator_subscription_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on SuiScan
                                </a>
                                <span>Cost: {subscription.cost} $SUI</span>
                                <Button asChild variant="outline" size="lg">
                                    <Link href={`creator/${subscription.creator_id}`}>
                                        View Creator
                                        <SquareArrowOutUpRight />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Subscriptions;
