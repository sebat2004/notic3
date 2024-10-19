'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImagePost from '@/components/ImagePost';
import BlogPost from '@/components/BlogPost';

type Params = {
    address: string;
};

export default function CreatorProfile({ params }: { params: Params }) {
    const address = params!.address;
    const account = useCurrentAccount();
    console.log(account?.address);

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
                            <AvatarImage src="https://i.pravatar.cc/300" alt="Creator profile" />
                            <AvatarFallback>CP</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold">Creator Profile</CardTitle>
                            <p className="text-sm opacity-75">Wallet Address:</p>
                            <p className="break-all font-mono text-sm">{address}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="mt-4">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Creator Name</h2>
                            <p className="text-sm text-gray-500">Joined: January 2023</p>
                            <div className="mt-2 flex space-x-2">
                                <Badge>Web3</Badge>
                                <Badge>Content Creator</Badge>
                                <Badge>Artist</Badge>
                            </div>
                        </div>
                        {account?.address === address ? (
                            <Button>Edit Profile</Button>
                        ) : (
                            <Button>Support Creator</Button>
                        )}
                    </div>
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">About</h3>
                        <p className="text-gray-600">
                            This is a placeholder description for the creator. You can replace this
                            with actual data from your backend or smart contract. The creator might
                            share their background, interests, and the type of content they produce
                            here.
                        </p>
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
                        <Tabs defaultValue="images">
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
