import { useCreators } from '@/hooks/use-creators';
import { CreatorCard } from './creator-card';
import { useSuiClientQuery } from '@mysten/dapp-kit';

export const CreatorList = () => {
    const { data, isPending, isError, error, refetch } = useSuiClientQuery('getObject', {
        id: process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ID,
        options: { showContent: true },
    });
    console.log(data);
    if (isPending) return <div>Loading...</div>;

    return (
        <section>
            <ul className="grid grid-cols-2 gap-2">
                {data?.data?.content?.fields.creators.map((creator) => (
                    <li key={creator}>
                        <CreatorCard creator={creator} />
                    </li>
                ))}
            </ul>
        </section>
    );
};
