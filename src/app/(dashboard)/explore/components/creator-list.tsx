import { useCreators } from '@/hooks/use-creators';
import { CreatorCard } from './creator-card';

export const CreatorList = () => {
    const { data, isPending, isFetching } = useCreators();

    if (isPending) return <div>Loading...</div>;

    return (
        <section>
            <ul className="grid grid-cols-2 gap-2">
                {data?.map((creator) => (
                    <li key={creator.address}>
                        <CreatorCard creator={creator} />
                    </li>
                ))}
            </ul>
        </section>
    );
};
