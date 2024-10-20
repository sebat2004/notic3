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
import { Textarea } from '@/components/ui/textarea';
import SubscriptionDropdown from './ui/SubscriptionDropdown';

const subscriptions = [{ label: 'Free Plan', value: 'free' }] as const;

const formSchema = z.object({
    subscription: z.string().min(1, {
        message: 'Subscription is required.',
    }),
    title: z
        .string()
        .min(2, {
            message: 'Title must be at least 2 characters.',
        })
        .max(100, {
            message: 'Title must be at most 100 characters.',
        }),
    content: z
        .string()
        .min(2, {
            message: 'content must be at least 2 characters.',
        })
        .max(500, {
            message: 'content must be at most 500 characters.',
        }),
});

export function CheckoutForm({ setOpen }: { setOpen: (open: boolean) => void }) {
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
    function onSubmit(values: z.infer) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setOpen(false);
        console.log(values);
        console.log('hi');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="flex items-center justify-between px-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Post title..." {...field} />
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

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="resize-none"
                                    placeholder="Post content..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
