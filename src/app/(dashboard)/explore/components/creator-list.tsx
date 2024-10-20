'use client';

import { CreatorCard } from './creator-card';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';
import { Creator, useCreators } from '@/hooks/use-creators';

export const CreatorList = () => {
    const { creators, isPending, isError, error, refetch } = useCreators();

    if (isPending) return <div>Loading...</div>;

    return (
        <section>
            <ul className="grid grid-cols-2 gap-2">
                {creators.map((creator) => {
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
