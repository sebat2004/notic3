'use client';

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
import SubscriptionDropdown from './ui/SubscriptionDropdown';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useState } from 'react';
import { useUploadFile } from '@/hooks/queries';
const subscriptions = [
    { label: 'Free', value: 'free' },
    { label: 'Basic', value: 'basic' },
    { label: 'Premium', value: 'premium' },
    { label: 'Pro', value: 'pro' },
] as const;

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_MB = MAX_UPLOAD_SIZE / 1024 / 1024;
const ACCEPTED_FILE_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

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
        }, 'File must be a video file')
        .refine((file) => {
            return !file || file.size <= MAX_UPLOAD_SIZE;
        }, `File size must be less than ${MAX_MB}MB`),
});

export function VideoUploadForm({
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
    const [preview, setPreview] = useState('');
    const { uploadFileAsync, encryptionIv, encryptionKey } = useUploadFile();

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
                        <video controls width="300">
                            <source src={preview} type="video/mp4" />
                        </video>
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Video File</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        onChange={(e) => {
                                            const { files, displayUrl } = getImageData(e);
                                            setPreview(displayUrl);
                                            console.log(files, displayUrl);
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

export default VideoUploadForm;
