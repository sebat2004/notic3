'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Transaction } from '@mysten/sui/transactions';
import { useSignTransaction, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'Subscription is required.',
    }),
    price: z.string().min(0, {
        message: 'Price must be positive.',
    }),
    length: z.string().min(0, {
        message: 'Length must be positive',
    }),
});

export function SubscriptionUploadForm() {
    const { mutateAsync: signTransaction } = useSignTransaction();
    const client = useSuiClient();

    // 1. Define your form.
    const form = useForm<z.infer>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subscription: '',
            content: '',
            title: '',
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        const tx = new Transaction();

        tx.moveCall({
            target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::subscription::initialize`,
            arguments: [
                tx.object(process.env.NEXT_PUBLIC_CREATOR_SUBSCRIPTION_REGISTRY_ID),
                tx.pure.string(values.title),
                tx.pure.u64(values.price),
                tx.pure.u64(values.length * 24 * 60 * 60 * 1000),
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

        // Always report transaction effects to the wallet after execution
        reportTransactionEffects(executeResult.rawEffects!);

        console.log(executeResult);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="flex flex-col items-center justify-between gap-3 px-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Subscription title..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="Subscription price..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="length"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Length</FormLabel>
                                <FormControl>
                                    <Input placeholder="Subscription length..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
