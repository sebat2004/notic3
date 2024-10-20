import { useQuery } from '@tanstack/react-query';
import { Creator, SAMPLE_CREATORS } from './use-creators';

export const getCreator = async (address: string): Promise<Creator> => {
    // Replace w/ RPC calls
    const creator = SAMPLE_CREATORS.find((c) => c.address === address);
    if (!creator) {
        throw new Error('Creator not found');
    }
    console.log('getCreator', creator);
    return creator;
};

export const useGetCreator = (address: string) => {
    return useQuery({
        queryKey: ['creators', address],
        queryFn: () => getCreator(address),
    });
};
