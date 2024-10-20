'use client';

import React, { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Image, Video, Type, ChartNoAxesColumn } from 'lucide-react';
import ContentOption from './components/ui/ContentOption';
import Link from 'next/link';
import { TextUploadForm } from './components/TextUploadForm';
import { SubscriptionUploadForm } from './components/SubscriptionUploadForm';
import ImageUploadForm from './components/ImageUploadForm';
import VideoUploadForm from './components/VideoUploadForm';
import CreateProfileForm from './components/CreateProfileForm';
import { useKeyPair } from '@/hooks/use-key-pair';
import { useDownloadUnencryptedFile } from '@/hooks/getdata';
import { saveAs } from 'file-saver';
import { Creator, useCreators } from '@/hooks/use-creators';

const CreatePage = () => {
    const [key, setKey] = useState(null);
    const [iv, setIv] = useState(null);
    const [blobId, setBlobId] = useState(null);
    const [registered, setRegistered] = useState(false);
    const [creator, setCreator] = useState(null);

    const account = useCurrentAccount();
    const { data: profileImage } = useDownloadUnencryptedFile(creator?.image);
    const creators = useCreators();
    const { data: keyPairData } = useKeyPair();

    useEffect(() => {
        if (!account) return;
        const currentCreator = creators.find((c) => c.address === account.address);
        if (currentCreator) {
            setRegistered(true);
            setCreator(currentCreator);
        }
    }, [account, creators]);

    if (!account) {
        return (
            <Alert className="m-4 text-4xl">
                <AlertTitle>No Account Connected</AlertTitle>
                <AlertDescription>
                    Please connect your wallet to access the Create Page and manage your profile.
                </AlertDescription>
            </Alert>
        );
    }

    if (!registered) {
        return (
            <div className="mx-auto my-10 w-full max-w-lg">
                <p className="text-center text-4xl font-bold">Create Profile</p>
                <CreateProfileForm setOpen={() => {}} />
            </div>
        );
    }

    const downloadKeypair = () => {
        const publicKeyHex = localStorage.getItem('notic3-pubkey');
        const privateKeyHex = localStorage.getItem('notic3-privkey');
        const keypairContent = `Public Key: ${publicKeyHex}\n\nPrivate Key: ${privateKeyHex}`;
        const blob = new Blob([keypairContent], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'keypair.txt');
    };

    return (
        <div className="flex w-full flex-col items-center justify-between gap-4 p-10">
            <ProfilePreviewCard creator={creator} profileImage={profileImage} account={account} />
            <div className="flex w-full items-center justify-between gap-4 lg:flex-row lg:items-start">
                <SubscriptionCard />
                <ContentCreationCard setIv={setIv} setKey={setKey} setBlobId={setBlobId} />
            </div>
            <EncryptionDetailsCard key={key} iv={iv} blobId={blobId} />
        </div>
    );
};

const ProfilePreviewCard = ({ creator, profileImage, account }) => (
    <Card className="h-full w-full p-2">
        <CardHeader>
            <CardTitle>Profile Preview</CardTitle>
            <CardDescription>Your public profile</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center">
                <img
                    src={profileImage || 'https://i.pravatar.cc/300'}
                    alt="Profile Picture"
                    className="h-24 w-24 rounded-full"
                />
                <h1 className="mt-2 text-2xl font-semibold">{creator?.name || 'Your Name'}</h1>
                <p className="text-sm text-muted-foreground">{creator?.bio || 'Your Bio'}</p>
            </div>
        </CardContent>
        <CardFooter>
            <Button asChild>
                <Link className="w-full" href={`creator/${account?.address}`} size="lg">
                    Edit Profile
                </Link>
            </Button>
        </CardFooter>
    </Card>
);

const SubscriptionCard = () => (
    <Card className="h-full w-full p-3 lg:w-[50%]">
        <CardHeader>
            <CardTitle>Create Subscription</CardTitle>
            <CardDescription>Create subscription tiers for specific content</CardDescription>
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
);

const ContentCreationCard = ({ setIv, setKey, setBlobId }) => (
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
);

const EncryptionDetailsCard = ({ key, iv, blobId }) => (
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
                Warning: Exposing encryption keys is not secure. This is for demonstration purposes
                only.
            </p>
        </CardFooter>
    </Card>
);

export default CreatePage;
