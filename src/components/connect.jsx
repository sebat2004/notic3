import { ConnectButton } from '@mysten/dapp-kit';

export function Connect() {
	return (
		<div className="absolute top-4 right-6">
			<ConnectButton />
		</div>
	);
}