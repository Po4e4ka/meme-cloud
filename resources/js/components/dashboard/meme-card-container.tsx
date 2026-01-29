import MemeCard, { MemeCardProps } from "@/components/dashboard/meme-card";
import MemePreviewDialog from "@/components/dashboard/meme-preview-dialog";
import { useState } from "react";

export type MemeCardContainerProps = {
    memes: MemeCardProps[]
}

export default function MemeCardContainer({ memes }: MemeCardContainerProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openPreview = (index: number) => {
        setActiveIndex(index);
        setIsOpen(true);
    };

    const handleClose = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setActiveIndex(null);
        }
    };

    const handlePrev = () => {
        if (activeIndex === null) return;
        setActiveIndex(Math.max(0, activeIndex - 1));
    };

    const handleNext = () => {
        if (activeIndex === null) return;
        setActiveIndex(Math.min(memes.length - 1, activeIndex + 1));
    };

    const activeMeme = activeIndex !== null ? memes[activeIndex] : null;

    return (
        <div className="p-4 sm:p-6">
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {memes.map((meme, index) => (
                    <MemeCard
                        id={meme.id}
                        title={meme.title}
                        image_url={meme.image_url}
                        media_url={meme.media_url}
                        type={meme.type}
                        onOpen={() => openPreview(index)}
                    />
                ))}
            </div>
            <MemePreviewDialog
                isOpen={isOpen}
                onOpenChange={handleClose}
                meme={activeMeme}
                onPrev={handlePrev}
                onNext={handleNext}
                hasPrev={activeIndex !== null && activeIndex > 0}
                hasNext={activeIndex !== null && activeIndex < memes.length - 1}
            />
        </div>
    );
}
