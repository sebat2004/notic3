'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useGetCreator } from '@/hooks/use-get-creator';
import { Image, Video, Type, ChartNoAxesColumn } from 'lucide-react';
import ContentOption from './components/ui/ContentOption';
import Link from 'next/link';
import { TextUploadForm } from './components/TextUploadForm';
import { SubscriptionUploadForm } from './components/SubscriptionUploadForm';
import ImageUploadForm from './components/ImageUploadForm';
import VideoUploadForm from './components/VideoUploadForm';
import CreateProfileForm from './components/CreateProfileForm';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import { KeyRound } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useKeyPair } from '@/hooks/use-key-pair';
import { useDownloadUnencryptedFile } from '@/hooks/getdata';
import { Skeleton } from '@/components/ui/skeleton';

const CreatePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [encryptedBlob, setEncryptedBlob] = useState<Blob | null>(null);
    const [key, setKey] = useState<CryptoKey | null>(null);
    const [iv, setIv] = useState<Uint8Array | null>(null);
    const [blobId, setBlobId] = useState<string | null>(null);
    const [registered, setRegistered] = useState(false);
    const [creator, setCreator] = useState(null);

    const suiClient = useSuiClient();
    const account = useCurrentAccount();
    const { data } = useDownloadUnencryptedFile(creator?.picture);

    const query = useKeyPair();
    const { publicKey, privateKey } = query.data || {};

    useEffect(() => {
        if (!account) return;
        (async () => {
            const res = await suiClient.getObject({
                id: process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ID,
                options: {
                    showContent: true,
                },
            });
            console.log(res)
            res.data?.content?.fields.creators.fields.contents.forEach((creator) => {
                if (creator.fields.key == account.address) {
                    setRegistered(true);
                    setCreator(creator.fields.value.fields);
                }
            });
        })();
    }, [account]);

    if (!registered) {
        return (
            <div className="mx-auto my-10 w-full max-w-lg">
                <p className="text-center text-4xl font-bold">Create Profile</p>
                <CreateProfileForm setOpen={() => {}} />
            </div>
        );
    }

    const DecodeBase64ToBinary = (base64String) => {
        try {
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        } catch (error) {
            console.error('Error decoding base64:', error);
            return new Uint8Array();
        }
    };

    const BytesToHex = (bytes) => {
        return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    };

    const publicKeyBase64 = localStorage.getItem('notic3-pubkey');
    const privateKeyBase64 = localStorage.getItem('notic3-privkey');

    const publicKeyHex = publicKeyBase64
        ? BytesToHex(DecodeBase64ToBinary(publicKeyBase64))
        : 'Not found';
    const privateKeyHex = privateKeyBase64
        ? BytesToHex(DecodeBase64ToBinary(privateKeyBase64))
        : 'Not found';

    return (
        <div className="flex w-full flex-col items-center justify-between gap-4 p-10">
            <Card className="h-full w-full p-2">
                <CardHeader>
                    <CardTitle>Profile Preview</CardTitle>
                    <CardDescription>Your public profile</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center">
                        <img
                            src="https://i.pravatar.cc/300"
                            alt="Profile Picture"
                            className="h-24 w-24 rounded-full"
                        />
                        <h1 className="mt-2 text-2xl font-semibold">{}</h1>
                        <p className="text-sm text-muted-foreground">Software Developer</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link className="w-full" href="" size="lg">
                            Edit Profile
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
            <div className="flex w-full items-center justify-between gap-4 lg:flex-row lg:items-start">
                {/* Profile Preview Card */}
                <Card className="h-full w-full p-3 lg:w-[50%]">
                    <CardHeader>
                        <CardTitle>Create Subscription</CardTitle>
                        <CardDescription>
                            Create subscription tiers for specific content
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SubscriptionUploadForm />
                    </CardContent>
                    <CardFooter>
                        <p className="text-center text-sm text-muted-foreground">
                            Note: Subscriptions are immutable
                        </p>
                    </CardFooter>
                </Card>
                <Card className="h-full w-full p-3 lg:w-[50%]">
                    <CardHeader>
                        <CardTitle>Create Content</CardTitle>
                        <CardDescription>Upload any content of your choosing</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <ContentOption
                                Form={ImageUploadForm}
                                Icon={Image}
                                tooltipText="Upload Image"
                                formTitle="Image"
                                setIv={setIv}
                                setKey={setKey}
                                setBlobId={setBlobId}
                            />
                            <ContentOption
                                Form={VideoUploadForm}
                                Icon={Video}
                                tooltipText="Upload Video"
                                formTitle="Video"
                                setIv={setIv}
                                setKey={setKey}
                                setBlobId={setBlobId}
                            />
                            <ContentOption
                                Form={TextUploadForm}
                                Icon={Type}
                                tooltipText="Create Blog Post"
                                formTitle="Text"
                                setIv={setIv}
                                setKey={setKey}
                                setBlobId={setBlobId}
                            />
                            <ContentOption
                                Form={TextUploadForm}
                                Icon={ChartNoAxesColumn}
                                tooltipText="Create Poll"
                                formTitle="Poll"
                                setIv={setIv}
                                setKey={setKey}
                                setBlobId={setBlobId}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-center text-sm text-muted-foreground">
                            Note: All content is encrypted before being uploaded to the chain
                        </p>
                    </CardFooter>
                </Card>
            </div>
            <Card className="mt-4 min-h-72 w-full">
                <CardHeader>
                    <CardTitle>Encryption Details</CardTitle>
                    <CardDescription>
                        Key and IV used for encryption (for demonstration only)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {key && (
                        <div>
                            <h3 className="text-lg font-semibold">Key:</h3>
                            <p className="break-all">{key}</p>
                        </div>
                    )}
                    {iv && (
                        <div className="mt-2">
                            <h3 className="text-lg font-semibold">IV:</h3>
                            <p className="break-all">{iv}</p>
                        </div>
                    )}
                    {blobId && (
                        <div className="mt-2">
                            <h3 className="text-lg font-semibold">Blob ID:</h3>
                            <p className="break-all">{blobId}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <p className="mt-32 text-sm text-red-500">
                        Warning: Exposing encryption keys is not secure. This is for demonstration
                        purposes only.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};
export default CreatePage;
