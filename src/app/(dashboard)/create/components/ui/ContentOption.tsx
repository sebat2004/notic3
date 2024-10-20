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
import { useState } from 'react';

const ContentOption = ({
    Icon,
    Form,
    tooltipText,
    formTitle,
    setIv,
    setKey,
    setBlobId,
}: {
    Icon: React.ElementType;
    Form: React.ElementType;
    tooltipText: string;
    formTitle: 'Text' | 'Image' | 'Video' | 'Poll';
    setIv?: (iv: Uint8Array) => void;
    setKey?: (key: CryptoKey) => void;
    setBlobId?: (blobId: string) => void;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Tooltip delayDuration={TOOLTIP_DELAY}>
            <TooltipProvider>
                <TooltipTrigger>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full" variant="outline" size="icon">
                                <Icon />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>{formTitle}</DialogTitle>
                            <Form
                                setOpen={setOpen}
                                setBlobId={setBlobId}
                                setIv={setIv}
                                setKey={setKey}
                            />
                        </DialogContent>
                    </Dialog>
                </TooltipTrigger>
                <TooltipContent>{tooltipText}</TooltipContent>
            </TooltipProvider>
        </Tooltip>
    );
};

export default ContentOption;
