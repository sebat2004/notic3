'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Transaction } from '@mysten/sui/transactions';
import { useSignTransaction, useSuiClient } from '@mysten/dapp-kit';

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_MB = MAX_UPLOAD_SIZE / 1024 / 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getImageData(event: ChangeEvent) {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer();

    // Add newly uploaded images
    Array.from(event.target.files!).forEach((image) => dataTransfer.items.add(image));

    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files![0]);

    return { files, displayUrl };
}

const formSchema = z.object({
    username: z
        .string()
        .min(3, {
            message: 'Name must be at least 3 characters.',
        })
        .max(99, {
            message: 'Name must be under 100 characters.',
        }),
    bio: z.string().min(1, {
        message: 'Bio is required.',
    }),
    avatar: z
        .instanceof(File, { message: 'Required' })
        .refine((file) => {
            return ACCEPTED_FILE_TYPES.includes(file.type);
        }, 'File must be a JPEG, PNG, or WEBP')
        .refine((file) => {
            return !file || file.size <= MAX_UPLOAD_SIZE;
        }, `File size must be less than ${MAX_MB}MB`),
});

export function CreateProfileForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const [preview, setPreview] = useState('');
    const client = useSuiClient();
    const { mutateAsync: signTransaction } = useSignTransaction();

    const form = useForm<z.infer>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    async function onSubmit(data: z.infer) {
        setOpen(false);

        const response = await fetch(
            `https://walrus-testnet-publisher.nodes.guru/v1/store?epochs=5`,
            {
                method: 'PUT',
                body: btoa(data.avatar),
                headers: {
                    'Content-Type': 'text/plain',
                },
            }
        );
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        const result = await response.json();
        console.log(result);
        const blobId = result.newlyCreated == undefined ? result.alreadyCertified.blobId : result.newlyCreated.blobObject.blobId;

        const tx = new Transaction();

        tx.moveCall({
            target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::subscription::register_creator`,
            arguments: [
                tx.object(process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ID),
                tx.pure.string(data.username),
                tx.pure.string(blobId),
                tx.pure.string(data.bio),
            ],
        });

        const { bytes, signature, reportTransactionEffects } = await signTransaction({
            transaction: tx,
            chain: 'sui:testnet',
        });

        const executeResult = await client.executeTransactionBlock({
            transactionBlock: bytes,
            signature,
            options: {
                showRawEffects: true,
                showObjectChanges: true,
            },
        });

        reportTransactionEffects(executeResult.rawEffects!);

        console.log(executeResult);

        toast({
            title: 'You submitted the following values:',
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                {preview && (
                    <div className="flex justify-center">
                        <img src={preview} alt="Preview" className="h-48 w-72 rounded-md" />
                    </div>
                )}
                <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        onChange={(e) => {
                                            const { files, displayUrl } = getImageData(e);
                                            setPreview(displayUrl);
                                            field.onChange(
                                                e.target.files ? e.target.files[0] : null
                                            );
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

export default CreateProfileForm;
