'use client';

import React from 'react';
import { CreatorList } from './components/creator-list';

function Creators() {
    return (
        <div className="my-12 w-full px-10">
            <h1 className="mb-6 text-center text-5xl font-bold">Featured Creators</h1>
            <CreatorList />
        </div>
    );
}

export default Creators;
