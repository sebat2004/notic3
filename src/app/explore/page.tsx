import React from 'react';
import { Separator } from '@/components/ui/separator';
import { CreatorCard } from '@/components/creator-card';

const SAMPLE_DATA = [
    {
        name: 'Creative Coding Tutorials',
        description:
            'Exclusive video tutorials and livestreams covering the latest in creative coding and generative art techniques.',
    },
    {
        name: 'Sustainable Living Guides',
        description:
            'Weekly content on eco-friendly practices, from zero-waste living to sustainable fashion and food tips.',
    },
    {
        name: 'Indie Game Dev Insights',
        description:
            'Behind-the-scenes updates, game design insights, and exclusive alpha/beta access to upcoming indie games.',
    },
    {
        name: 'Music Production Masterclass',
        description:
            'Learn the art of music production with in-depth tutorials, project files, and personalized feedback sessions.',
    },
    {
        name: 'Digital Illustration Lessons',
        description:
            'Monthly courses on digital illustration techniques, including access to brush packs, timelapses, and portfolio reviews.',
    },
];

const ExplorePage = () => {
    return (
        <div className="mt-12 w-full px-10">
            <h1 className="mb-4 text-center text-5xl font-bold">Featured Creators</h1>
            <div className="grid grid-cols-2 gap-4">
                {SAMPLE_DATA.map((creator) => (
                    <CreatorCard
                        key={creator.name}
                        name={creator.name}
                        description={creator.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExplorePage;
