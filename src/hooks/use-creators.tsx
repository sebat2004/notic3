import { useSuiClientQuery, useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

export interface Creator {
    address: string; // crypto address
    name: string;
    bio: string;
    image: string;
}

export const useCreators = () => {
    const suiClient = useSuiClient();
    const [creators, setCreators] = useState<Creator[]>([]);

    useEffect(() => {
        const fetchCreators = async () => {
            const registryResp = await suiClient.getObject({
                id: process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ID,
                options: {
                    showContent: true,
                },
            });

            console.log(registryResp);

            const ids: string[] = [];
            registryResp!.data!.content!.fields.creators.fields.contents.forEach((c) => {
                ids.push(c.fields.value);
            });

            const usersResp = await suiClient.multiGetObjects({
                ids,
                options: {
                    showContent: true,
                },
            });

            console.log(usersResp);

            setCreators(
                usersResp.map((rawCreator: any) => ({
                    name: rawCreator.data.content.fields.value.fields.name as string,
                    bio: rawCreator.data.content.fields.value.fields.bio as string,
                    address: rawCreator.data.content.fields.creator_address as string,
                    image: rawCreator.data.content.fields.value.fields.picture as string,
                }))
            );
        };

        fetchCreators();
    }, []);

    return creators;
};
