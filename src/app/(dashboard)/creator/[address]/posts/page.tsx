'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ShoppingBag } from 'lucide-react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImagePost from '@/components/ImagePost';
import BlogPost from '@/components/BlogPost';
import { useGetCreator } from '@/hooks/use-get-creator';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPost from '@/components/VideoPost';
import { useEffect, useState } from 'react';
import { useDownloadUnencryptedFile } from '@/hooks/getdata';
import Link from 'next/link';
import { useSignTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useKeyPair } from '@/hooks/use-key-pair';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { bcs } from '@mysten/bcs';
import { ArrowLeft } from 'lucide-react';

type Params = {
    address: string;
};

const posts = [
    {
        type: 'video',
        title: 'Video Post',
        description: 'This is a placeholder description for the video post.',
        videoUrl:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
        type: 'blog',
        title: 'Blog Post',
        description:
            'Hello World! This is a placeholder description for the blog post. You can replace this with actual content from your backend or smart contract.',
    },
    {
        type: 'image',
        title: 'Image Post',
        description: 'This is a placeholder description for the image post.',
        imageUrl: 'https://i.pravatar.cc/301',
    },
    {
        type: 'video',
        title: 'Video Post',
        description: 'This is a placeholder description for the video post.',
        videoUrl:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
        type: 'image',
        title: 'Image Post',
        description: 'This is a placeholder description for the image post.',
        imageUrl: 'https://i.pravatar.cc/302',
    },
];

export default function CreatorPosts({ params }: { params: Params }) {
    const address = params!.address;
    const account = useCurrentAccount();
    const [creator, setCreator] = useState<any>();
    const suiClient = useSuiClient();
    const [exportedKey, setExportKey] = useState<ArrayBuffer>();
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [registered, setRegistered] = useState(false);
    const [userAvatarBlob, setUserAvatarBlob] = useState<string | null>(null);
    const [creatorSubscriptions, setCreatorSubscriptions] = useState([]);
    const { data, isLoading } = useDownloadUnencryptedFile(userAvatarBlob);
    const { mutateAsync: signTransaction } = useSignTransaction();
    console.log(userAvatarBlob);

    const keyPairQuery = useKeyPair();

    useEffect(() => {
        if (!account) return;
        (async () => {
            const res = await suiClient.getObject({
                id: process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ID,
                options: {
                    showContent: true,
                },
            });
            res.data?.content?.fields.creators.fields.contents.forEach(async (creator) => {
                if (creator.fields.key === address) {
                    if (creator.fields.key == account.address) setRegistered(true);

                    const creatorResp = await suiClient.getObject({
                        id: creator.fields.value,
                        options: {
                            showContent: true,
                        },
                    });

                    setCreator(creatorResp.data?.content.fields);

                    setUserAvatarBlob(creatorResp.data?.content.fields.picture);

                    const registryResp = await suiClient.getObject({
                        id: process.env.NEXT_PUBLIC_CREATOR_SUBSCRIPTION_REGISTRY_ID,
                        options: {
                            showContent: true,
                        },
                    });

                    const subsriptionsResp = await suiClient.multiGetObjects({
                        ids: registryResp.data.content.fields.subscriptions,
                        options: {
                            showContent: true,
                        },
                    });

                    const filtered = subsriptionsResp.filter(
                        (s) => s.data?.content.fields.creator == address
                    );
                    console.log(filtered);
                    setCreatorSubscriptions(filtered);
                }
            });
        })();
    }, [account]);

    console.log('CREATOR', creator);
    // Validate the address (this is a simple check, you might want to use a more robust validation)
    // const isValidAddress = address && /^0x[a-fA-F0-9]{40}$/.test(address);

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <div className="items-between flex justify-center space-x-4">
                        <div className="ml-4 flex w-full items-center">
                            <Avatar className="mr-2">
                                {profileImageUrl ? (
                                    <AvatarImage src={profileImageUrl} alt={creator?.name} />
                                ) : (
                                    <AvatarFallback>{creator?.name?.charAt(0)}</AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <CardTitle>{creator?.name}</CardTitle>
                                <p className="text-sm text-gray-500">{creator?.bio}</p>
                            </div>
                        </div>
                        <Button onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2" />
                            Back
                        </Button>
                    </div>
                </CardHeader>
            </Card>
            <div className="mt-4">
                {/* Past Posts Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Past Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all">
                            <TabsList>
                                <TabsTrigger value="all">All Posts</TabsTrigger>
                                <TabsTrigger value="images">Images</TabsTrigger>
                                <TabsTrigger value="videos">Videos</TabsTrigger>
                                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                                <TabsTrigger value="polls">Polls</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-4" value="all">
                                {posts.length === 0 && (
                                    <div className="text-gray-500">
                                        No posts found. Check back later!
                                    </div>
                                )}
                                {posts.map((post) => {
                                    if (post.type === 'image') {
                                        return (
                                            <ImagePost
                                                key={post.title + 'all'}
                                                imageUrl={post.imageUrl}
                                                title={post.title}
                                                description={post.description}
                                            />
                                        );
                                    } else if (post.type === 'video') {
                                        return (
                                            <VideoPost
                                                key={post.title + 'all'}
                                                videoUrl={post.videoUrl}
                                                title={post.title}
                                                description={post.description}
                                            />
                                        );
                                    } else {
                                        return (
                                            <BlogPost
                                                key={post.title + 'all'}
                                                title={post.title}
                                                description={post.description}
                                            />
                                        );
                                    }
                                })}
                            </TabsContent>

                            <TabsContent className="flex flex-col gap-4" value="images">
                                {posts.filter((post) => post.type === 'image').length === 0 && (
                                    <div className="text-gray-500">
                                        No image posts found. Check back later!
                                    </div>
                                )}

                                {posts.map((post) => {
                                    if (post.type === 'image') {
                                        return (
                                            <ImagePost
                                                key={post.title}
                                                imageUrl={post.imageUrl}
                                                title={post.title}
                                                description={post.description}
                                            />
                                        );
                                    }
                                })}
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-4" value="videos">
                                {posts.filter((post) => post.type === 'video').length === 0 && (
                                    <div className="text-gray-500">
                                        No video posts found. Check back later!
                                    </div>
                                )}
                                {posts.map((post) => {
                                    if (post.type === 'video') {
                                        return (
                                            <VideoPost
                                                key={post.title}
                                                videoUrl={post.videoUrl}
                                                title={post.title}
                                                description={post.description}
                                            />
                                        );
                                    }
                                })}
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-4" value="blogs">
                                {posts.filter((post) => post.type === 'blog').length === 0 && (
                                    <div className="text-gray-500">
                                        No blog posts found. Check back later!
                                    </div>
                                )}
                                {posts.map((post) => {
                                    if (post.type === 'blog') {
                                        return (
                                            <BlogPost
                                                key={post.title}
                                                title={post.title}
                                                description={post.description}
                                            />
                                        );
                                    }
                                })}
                            </TabsContent>
                            <TabsContent value="polls">
                                <div>No Polls yet</div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
