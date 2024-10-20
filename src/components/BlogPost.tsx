interface BlogPostProps {
    title: string;
    description: string;
}
import { Card, CardHeader, CardContent } from './ui/card';
const BlogPost: React.FC<BlogPostProps> = ({ title, description }) => {
    return (
        <Card className="mx-auto w-[100%] shadow-lg">
            <CardHeader className="p-4">
                <h1 className="text-2xl font-semibold">{title}</h1>
            </CardHeader>
            <CardContent className="p-4">
                <p className="text-gray-700">{description}</p>
            </CardContent>
        </Card>
    );
};

export default BlogPost;
