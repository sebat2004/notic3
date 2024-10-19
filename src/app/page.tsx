'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Login() {
    return (
        <div className="flex h-screen flex-col">
            <Logo className="text-[20vw]" />
            <Button asChild className="absolute bottom-12 right-12 bg-blue-800 font-mono">
                <Link href="/explore">Login</Link>
            </Button>
        </div>
    );
}
