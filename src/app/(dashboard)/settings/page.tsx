'use client';

import { useKeyPair } from '@/hooks/use-key-pair';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const Settings = () => {
    const { data, isPending } = useKeyPair();
    const [showPrivateKey, setShowPrivateKey] = useState(false);

    const publicKey = data?.rawPublicKey || 'loading...';
    const privateKey = data?.rawPrivateKey || 'loading...';

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="my-12 w-full px-10">
            <h1 className="mb-6 text-center text-5xl font-bold">Settings</h1>
            <TooltipProvider>
                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Your Secrets</CardTitle>
                        <CardDescription>
                            View your public and private keys. These cannot be edited.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="public-key" className="text-base">
                                Public Key
                            </Label>
                            <div className="flex space-x-2">
                                <div className="relative flex-grow">
                                    <Textarea
                                        id="public-key"
                                        value={publicKey}
                                        readOnly
                                        className="min-h-[100px] px-6 font-mono text-sm"
                                    />
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => copyToClipboard(publicKey)}
                                            size="icon"
                                            variant="outline"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Copy public key</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="private-key" className="text-base">
                                Private Key
                            </Label>
                            <div className="flex space-x-2">
                                <div className="relative flex-grow">
                                    <Textarea
                                        id="private-key"
                                        value={
                                            showPrivateKey || isPending
                                                ? privateKey
                                                : '*'.repeat(privateKey.length)
                                        }
                                        readOnly
                                        className="min-h-[200px] px-6 font-mono text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() => copyToClipboard(privateKey)}
                                        size="icon"
                                        variant="outline"
                                        className="h-10 w-10"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={() => setShowPrivateKey(!showPrivateKey)}
                                                size="sm"
                                                variant="outline"
                                                className="h-10 w-10"
                                            >
                                                {showPrivateKey ? (
                                                    <>
                                                        <EyeOff className="h-4 w-4" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {showPrivateKey
                                                ? 'Hide private key'
                                                : 'Show private key'}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TooltipProvider>
        </div>
    );
};

export default Settings;
