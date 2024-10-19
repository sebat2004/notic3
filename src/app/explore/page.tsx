'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';

import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { CreatorList } from './components/creator-list';

function Creators() {
    const account = useCurrentAccount();

    if (!account) {
        return null;
    }

    return (
        <div className="mt-12 w-full px-10">
            <h1 className="mb-4 text-center text-5xl font-bold">Featured Creators</h1>
            <CreatorList />
            <div>Connected to {account.address}</div>
            <Objects address={''} />
        </div>
    );
}

function Objects({ address }: { address: string }) {
    const { data } = useSuiClientQuery('getObject', {
        id: address,
    });

    if (!data || !data.data) return <div>No data return</div>;

    return (
        <div key={data.data.objectId}>
            <a href={`https://example-explorer.com/object/${data.data?.objectId}`}>
                {data.data.objectId}
            </a>
        </div>
    );
}

export default Creators;
