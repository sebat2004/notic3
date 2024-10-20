interface ImagePostProps {
    imageUrl: string;
    title: string;
    description: string;
}
import { Card, CardHeader, CardContent } from './ui/card';
const ImagePost: React.FC<ImagePostProps> = ({ imageUrl, title, description }) => {
    return (
        <Card className="mx-auto w-[100%] shadow-lg">
            <CardHeader className="p-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
            </CardHeader>
            <CardContent className="p-4">
                <img
                    src={imageUrl}
                    alt={title}
                    className="mb-2 h-60 w-full rounded-t-lg object-cover"
                />
                <p className="text-gray-700">{description}</p>
            </CardContent>
        </Card>
    );
};

export default ImagePost;
