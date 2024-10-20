'use client';
import React from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight, Lock, Globe, Wallet } from 'lucide-react';

export default function Login() {
    return (
        <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white p-8 text-gray-900">
            <div className="w-full max-w-4xl space-y-16 text-center">
                <div className="space-y-6">
                    <Logo className="mx-auto text-[8vw]" />
                </div>

                <div className="space-y-8">
                    <p className="mx-auto max-w-2xl pb-4 text-xl font-light leading-relaxed">
                        Empower your creativity with the future of content monetization. n̈otic3 is
                        the Web3 revolution for content creators, offering a decentralized platform
                        with unparalleled security and transparency.
                    </p>
                    <div className="flex justify-center space-x-12">
                        <Feature
                            icon={<Lock className="h-10 w-10 text-blue-600" />}
                            text="No Backend, Maximum Privacy"
                        />
                        <Feature
                            icon={<Globe className="h-10 w-10 text-blue-600" />}
                            text="Fully Decentralized"
                        />
                        <Feature
                            icon={<Wallet className="h-10 w-10 text-blue-600" />}
                            text="Powered by SUI Blockchain"
                        />
                    </div>
                </div>

                <Button
                    asChild
                    className="transform rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
                >
                    <Link href="/explore" className="flex items-center">
                        Start Creating <ChevronRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}

const Feature = ({ icon, text }) => (
    <div className="flex flex-col items-center space-y-3">
        {icon}
        <p className="text-lg font-semibold">{text}</p>
    </div>
);
