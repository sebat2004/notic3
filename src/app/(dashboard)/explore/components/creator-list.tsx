'use client';

import { CreatorCard } from './creator-card';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';

interface Creator {
    name: string;
    bio: string;
    avatar: string;
}

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
                {data?.data?.content?.fields.creators.fields.contents.map((creator) => {
                    return (
                        <li key={creator}>
                            <CreatorCard creator={creator} />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};
