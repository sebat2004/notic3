'use client';

import React from 'react';

import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

function Creators() {
    const account = useCurrentAccount();

    if (!account) {
        return null;
    }

    return (
        <div>
            <div>Connected to {account.address}</div>;
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
