interface VideoPostProps {
    videoUrl: string;
    title: string;
    description: string;
}
import { Card, CardHeader, CardContent } from './ui/card';

const VideoPost: React.FC<VideoPostProps> = ({ videoUrl, title, description }) => {
    return (
        <Card className="mx-auto w-[100%] shadow-lg">
            <CardHeader className="p-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4">
                <video controls className="h-auto max-w-full">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <p className="text-gray-700">{description}</p>
            </CardContent>
        </Card>
    );
};

export default VideoPost;
