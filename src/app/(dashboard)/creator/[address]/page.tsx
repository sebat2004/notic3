'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Edit } from 'lucide-react';
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

type Params = {
    address: string;
};

export default function CreatorProfile({ params }: { params: Params }) {
    const address = params!.address;
    const account = useCurrentAccount();
    const [creator, setCreator] = useState<any>();
    const suiClient = useSuiClient();
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [registered, setRegistered] = useState(false);
    const { mutate, data, isLoading } = useDownloadUnencryptedFile();

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
                    setCreator(creator.fields.value.fields);
                    if (creator.fields.key == account.address) setRegistered(true);
                    const profileImage = creator.fields.value.fields.picture;
                    if (profileImage) {
                        mutate(profileImage, {
                            onSuccess: (data) => {
                                console.log('DATA', data);
                                setProfileImageUrl(data);
                            },
                        });
                    }
                }
            });
        })();
    }, [account]);

    console.log('CREATOR', creator);
    // Validate the address (this is a simple check, you might want to use a more robust validation)
    // const isValidAddress = address && /^0x[a-fA-F0-9]{40}$/.test(address);

    const isValidAddress = true;

    if (!isValidAddress) {
        return (
            <div className="container mx-auto p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Invalid Address</AlertTitle>
                    <AlertDescription>
                        The provided address is not valid. Please check the URL and try again.
                        <p className="mt-2 break-all font-mono text-sm">
                            Provided address: {address || 'No address provided'}
                        </p>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader className="bg-gradient-to-r from-black to-gray-500 text-white">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20 border-4 border-white">
                            <AvatarImage src={profileImageUrl} alt="Creator profile" />
                            <AvatarFallback>CP</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold">{creator?.name}</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="mt-4 h-max py-0">
                    <div className="flex flex-col justify-between gap-10">
                        <div className="mt-1 flex justify-between gap-1">
                            <div className="items-left flex flex-col justify-between">
                                <h1 className="text-xl font-semibold">About</h1>
                                {!creator ? (
                                    <div className="flex flex-col gap-3">
                                        <Skeleton className="h-[16px] w-[100%] bg-gray-200" />
                                        <Skeleton className="h-[16px] w-[70%] bg-gray-200" />
                                    </div>
                                ) : (
                                    <div className="mt-2 flex flex-col justify-center gap-2">
                                        <p className="text-gray-600">{creator?.bio}</p>
                                        <p className="text-sm text-gray-500">
                                            Joined: January 2023
                                        </p>
                                    </div>
                                )}
                            </div>

                            {!registered && <Button>Support Creator</Button>}
                        </div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <div className="mt-2 flex space-x-2">
                                    <Badge>Web3</Badge>
                                    <Badge>Content Creator</Badge>
                                    <Badge>Artist</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
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
                            <TabsContent value="all">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <ImagePost
                                        imageUrl="https://i.pravatar.cc/300"
                                        title="Image Post"
                                        description="This is a placeholder description for the image post."
                                    />
                                    <BlogPost
                                        title="Blog Post"
                                        description="Hello World! This is a placeholder description for the blog post. You can replace this with actual content from your backend or smart contract."
                                    />
                                    <VideoPost
                                        videoUrl="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                                        title="Video Post"
                                        description="This is a placeholder description for the video post."
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent value="images">
                                <div>Images</div>
                            </TabsContent>
                            <TabsContent value="videos">
                                <div>Videos</div>
                            </TabsContent>
                            <TabsContent value="blogs">
                                <div>Blogs</div>
                            </TabsContent>
                            <TabsContent value="polls">
                                <div>Polls</div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
