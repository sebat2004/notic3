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

import { Image, Video, Type, ChartNoAxesColumn } from 'lucide-react';
import ContentOption from './components/ui/ContentOption';
import { TextUploadForm } from './components/TextUploadForm';
import { useUploadFile } from '@/hooks/queries';

const CreatePage = () => {
    const [key, setKey] = React.useState<CryptoKey | null>(null);
    const [isClient, setIsClient] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [encryptedBlob, setEncryptedBlob] = useState<Blob | null>(null);

    useEffect(() => {
        setIsClient(true);

        (async () => {
            const newKey = await crypto.subtle.generateKey(
                {
                    name: 'AES-GCM',
                    length: 256, // Key length in bits
                },
                true, // Extractable
                ['encrypt', 'decrypt'] // Key usages
            );
            setKey(newKey);
        })();
    }, []);

    const uploadFileMutation = useUploadFile();

    useEffect(() => {
        crypto.subtle
            .generateKey(
                {
                    name: 'AES-GCM',
                    length: 256, // Key length in bits
                },
                true, // Extractable
                ['encrypt', 'decrypt'] // Key usages
            )
            .then(setKey);

        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, []);

    if (!isClient) {
        return null;
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (!file || !key) {
            return;
        }

        setPreviewUrl(URL.createObjectURL(file));

        const fileData = await file.arrayBuffer();
        const encryptedFile = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: new Uint8Array(12), // Initialization vector
            },
            key,
            fileData
        );
        const blob1 = new Blob([encryptedFile]);

        if (!isClient) {
            return null;
        }

        setEncryptedBlob(new Blob([encryptedFile]));

        uploadFileMutation
            .mutateAsync(encryptedFile)
            .then((response) => {
                console.log('Upload successful:', response);
                // Handle successful upload (e.g., show success message to user)
            })
            .catch((error) => {
                console.error('Upload failed:', error);
                // Handle error (e.g., show error message to user)
            });
    };

    return (
        <div className="flex w-full items-center justify-between p-10">
            {/* <Card className="w-[38%] p-3">
                <CardHeader>
                    <CardTitle>Create Content</CardTitle>
                    <CardDescription>Upload any content of your choosing</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-[100%] flex-col items-center justify-center">
                        <Card className="h-[20vh] w-full">
                            {previewUrl && (
                                <div className="flex h-full w-full items-center justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            )}
                        </Card>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleUpload}
                            accept="image/*"
                            className="invisible"
                        />
                        <Button variant="outline" onClick={handleButtonClick} disabled={!key}>
                            Upload File
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-muted-foreground text-center text-sm">
                        Note: The file will be encrypted before being uploaded.
                    </p>
                </CardFooter>
            </Card> */}

            <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:items-start">
                {/* Profile Preview Card */}
                <Card className="h-full w-full p-2 lg:w-[60%]">
                    <CardHeader>
                        <CardTitle></CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center">
                            <img
                                src="https://i.pravatar.cc/300"
                                alt="Profile Picture"
                                className="h-24 w-24 rounded-full"
                            />
                            <h1 className="mt-2 text-2xl font-semibold">John Doe</h1>
                            <p className="text-sm text-muted-foreground">Software Developer</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline" size="lg">
                            Edit Profile
                        </Button>
                    </CardFooter>
                </Card>

                {/* Upload Content Card */}
                <Card className="h-full w-full p-3 lg:w-[40%]">
                    <CardHeader>
                        <CardTitle>Create Content</CardTitle>
                        <CardDescription>Upload any content of your choosing</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <ContentOption
                                Form={TextUploadForm}
                                Icon={Image}
                                tooltipText="Upload Image"
                                formTitle="Image"
                            />
                            <ContentOption
                                Form={TextUploadForm}
                                Icon={Video}
                                tooltipText="Upload Video"
                                formTitle="Video"
                            />
                            <ContentOption
                                Form={TextUploadForm}
                                Icon={Type}
                                tooltipText="Create Text Post"
                                formTitle="Text"
                            />
                            <ContentOption
                                Form={TextUploadForm}
                                Icon={ChartNoAxesColumn}
                                tooltipText="Create Poll"
                                formTitle="Poll"
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
        </div>
    );
};

export default CreatePage;
