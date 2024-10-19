import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { TOOLTIP_DELAY } from '@/constants';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { TextUploadForm } from '../TextUploadForm';
import { Input } from '@/components/ui/input';

const ContentOption = ({
    Icon,
    Form,
    tooltipText,
    formTitle,
}: {
    Icon: React.ElementType;
    Form: React.ElementType;
    tooltipText: string;
    formTitle: 'Text' | 'Image' | 'Video' | 'Poll';
}) => {
    return (
        <Tooltip delayDuration={TOOLTIP_DELAY}>
            <TooltipProvider>
                <TooltipTrigger>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full" variant="outline" size="icon">
                                <Icon />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <Form />
                        </DialogContent>
                    </Dialog>
                </TooltipTrigger>
                <TooltipContent>{tooltipText}</TooltipContent>
            </TooltipProvider>
        </Tooltip>
    );
};

export default ContentOption;
