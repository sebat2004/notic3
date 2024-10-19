interface ImagePostProps {
    imageUrl: string;
    title: string;
    description: string;
}
import { Card, CardHeader, CardContent } from './ui/card';
const ImagePost: React.FC<ImagePostProps> = ({ imageUrl, title, description }) => {
    return (
        <Card className="mx-auto max-w-[100%] shadow-lg">
            <CardHeader className="p-4">
                <img src={imageUrl} alt={title} className="h-48 w-full rounded-t-lg object-cover" />
            </CardHeader>
            <CardContent className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{title}</h2>
                <p className="text-gray-700">{description}</p>
            </CardContent>
        </Card>
    );
};

export default ImagePost;
