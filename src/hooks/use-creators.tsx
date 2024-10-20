import { useSuiClientQuery, useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';

export interface Creator {
    address: string; // crypto address
    name: string;
    description: string;
    image: string;
}

export const SAMPLE_CREATORS: Creator[] = [
    {
        address: '0x66a4069f218cfc1b0556b5a325ab62c016cfba94b4b9a7c71d2e355fcb02aa07',
        name: 'Sebastian Torresola',
        description: 'Software engineer and creator of notic3.',
        image: 'https://i.pravatar.cc/300',
    },
    {
        address: '0x1A2b3C4d5E6f7G8h9I0J',
        name: 'The Try Guys',
        description: 'Comedy and fun experiments with friends.',
        image: 'https://i.pravatar.cc/301',
    },
    {
        address: '0x2B3c4D5e6F7G8h9I0J1K',
        name: 'Amanda Palmer',
        description: 'Musician and performance artist creating new music and art.',
        image: 'https://i.pravatar.cc/302',
    },
    {
        address: '0x3C4d5E6f7G8H9i0J1K2L',
        name: 'Kurzgesagt – In a Nutshell',
        description: 'Explainer videos on science, space, and futuristic technology.',
        image: 'https://i.pravatar.cc/303',
    },
    {
        address: '0x4D5e6F7g8H9I0j1K2L3M',
        name: 'Chapo Trap House',
        description: 'Podcast and political commentary.',
        image: 'https://i.pravatar.cc/304',
    },
    {
        address: '0x5E6f7G8h9I0J1k2L3M4N',
        name: 'Cinematic Captures',
        description: 'Fan films and tutorials for creating cinematic Star Wars content.',
        image: 'https://i.pravatar.cc/305',
    },
    {
        address: '0x6F7g8H9i0J1K2l3M4N5O',
        name: 'True Crime Obsessed',
        description: 'Comedy podcast reviewing true crime documentaries.',
        image: 'https://i.pravatar.cc/306',
    },
    {
        address: '0x7G8h9I0J1K2L3M4n5O6P',
        name: 'Jacob Geller',
        description: 'Video essays on games, media, and storytelling.',
        image: 'https://i.pravatar.cc/307',
    },
    {
        address: '0x8H9i0J1k2L3M4N5o6P7Q',
        name: 'Philosophy Tube',
        description: 'Educational videos on philosophy, politics, and societal issues.',
        image: 'https://i.pravatar.cc/308',
    },
    {
        address: '0x9I0j1K2L3M4N5O6p7Q8R',
        name: 'Nerdwriter1',
        description: 'Video essays on art, culture, and entertainment.',
        image: 'https://i.pravatar.cc/309',
    },
    {
        address: '0x0J1K2L3M4N5O6P7Q8r9S',
        name: 'Extra Credits',
        description: 'Educational content on game design, history, and mythology.',
        image: 'https://i.pravatar.cc/310',
    },
];

export const fetchCreators = async (subscribedOnly: true) => {
    const client = useSuiClient();
    const res = await client.getObject({
        id: process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ID,
        options: {
            showContent: true,
        },
    });
    return res?.data?.content?.fields.creators;
};

export const useCreators = (subscribedOnly: boolean = false) => {
    const { data, isPending, isError, error, refetch } = useSuiClientQuery(
        'getObject',
        { id: process.env.NEXT_PUBLIC_CREATOR_SUBSCRIPTION_REGISTRY_ID },
        { showContent: true }
    );

    console.log(data);
};
