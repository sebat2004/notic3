'use client';

import { CreatorCard } from './creator-card';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';
import { Creator } from '@/hooks/use-creators';

export const CreatorList = () => {
    const [creators, setCreators] = useState([]);
    const { data, isPending, isError, error, refetch } = useSuiClientQuery('getObject', {
        id: process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ID,
        options: { showContent: true },
    });

    useEffect(() => {
        if (!data) return;
        data?.data?.content?.fields.creators.fields.contents.forEach(async (creator) => {
            console.log(creator.fields.value.fields.picture);
            const response = await fetch(
                `https://aggregator.walrus-testnet.walrus.space/v1/${creator.fields.value.fields.picture}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                }
            );
            console.log(response);
        });
    }, [data]);

    if (isPending) return <div>Loading...</div>;

    return (
        <section>
            <ul className="grid grid-cols-2 gap-2">
                {data?.data?.content?.fields.creators.fields.contents.map((rawCreator) => {
                    const creator: Creator = {
                        name: rawCreator.fields.value.fields.name as string,
                        bio: rawCreator.fields.value.fields.bio as string,
                        address: rawCreator.fields.key as string,
                        image: rawCreator.fields.value.fields.picture as string,
                    };
                    console.log(rawCreator.fields.value.fields.picture);
                    return (
                        <li key={creator.address}>
                            <CreatorCard creator={creator} />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};
