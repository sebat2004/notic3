'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast, useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import SubscriptionDropdown from './ui/SubscriptionDropdown';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useState } from 'react';
import { useUploadFile } from '@/hooks/queries';

const subscriptions = [
    { label: 'Free', value: 'free' },
    { label: 'Semi-Horny', value: 'semi-horny' },
    { label: 'Horny', value: 'horny' },
    { label: 'Very Horny', value: 'very-horny' },
] as const;

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
    title: z
        .string()
        .min(2, {
            message: 'Title must be at least 2 characters.',
        })
        .max(100, {
            message: 'Title must be at most 100 characters.',
        }),
    subscription: z.string().min(1, {
        message: 'Subscription is required.',
    }),
    file: z
        .instanceof(File)
        .refine((file) => {
            return ACCEPTED_FILE_TYPES.includes(file.type);
        }, 'File must be a JPEG, PNG, or WEBP')
        .refine((file) => {
            return !file || file.size <= MAX_UPLOAD_SIZE;
        }, `File size must be less than ${MAX_MB}MB`),
});

export function ImageUploadForm({
    setOpen,
    setKey,
    setIv,
    setBlobId,
}: {
    setOpen: (open: boolean) => void;
    setKey: (key: string) => void;
    setIv: (iv: string) => void;
    setBlobId: (blobId: string) => void;
}) {
    const { uploadFileAsync, encryptionIv, encryptionKey } = useUploadFile();
    const [preview, setPreview] = useState('');
    console.log(encryptionIv, encryptionKey);

    const disableSubmit = !encryptionIv || !encryptionKey;

    const form = useForm<z.infer>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            file: new File([], ''),
        },
    });

    async function onSubmit(data: z.infer) {
        setOpen(false);
        console.log(data);
        setKey(encryptionKey);
        setIv(encryptionIv);

        const res = await uploadFileAsync(data.file);
        if (res?.newlyCreated) {
            setBlobId(res.newlyCreated.blobObject.blobId);
            console.log('File uploaded successfully', res);
        } else {
            console.error('Failed to upload file');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subscription"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Subscription</FormLabel>
                                <SubscriptionDropdown
                                    subscriptions={subscriptions}
                                    field={field}
                                    form={form}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {preview && (
                    <div className="flex justify-center">
                        <img src={preview} alt="Preview" className="h-48 w-72 rounded-md" />
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>File</FormLabel>
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
                <Button disabled={disableSubmit} type="submit">
                    Submit
                </Button>
            </form>
        </Form>
    );
}

export default ImageUploadForm;
