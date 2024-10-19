"use client"

import React from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

const SUBSCRIPTION_TYPE = "PACKAGE_ADDRESS::subscription::Subscription"

function Subscriptions() {
	const account = useCurrentAccount();

	if (!account) {
		return null;
	}

	return (
		<div>
			<div>Connected to {account.address}</div>
			<OwnedObjects address={account.address} />
		</div>
	);
}

function OwnedObjects({ address }: { address: string }) {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: address,
        options: {
            showType: true,
            showContent: true,
        },
        filter: {
            StructType: SUBSCRIPTION_TYPE
        }
	});

	if (!data || data.data.length == 0) return <div>No data return</div>
    if (data.data.length == 0) return <div>You do not have any subscriptions</div>

	return (
        <ul>
            {data.data.map((object) => (
                <li key={object.data?.objectId}>
                    <a href={`https://suiscan.xyz/testnet/object/${object.data?.objectId}`} target="_blank">
                        {object.data?.objectId}
                    </a>
                </li>
            ))}
        </ul>
	);
}

export default Subscriptions;
