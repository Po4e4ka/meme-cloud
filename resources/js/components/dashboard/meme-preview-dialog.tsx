import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MemeCardProps } from "@/components/dashboard/meme-card";

type MemePreviewDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    meme: MemeCardProps | null;
    onPrev: () => void;
    onNext: () => void;
    hasPrev: boolean;
    hasNext: boolean;
};

export default function MemePreviewDialog({
    isOpen,
    onOpenChange,
    meme,
    onPrev,
    onNext,
    hasPrev,
    hasNext,
}: MemePreviewDialogProps) {
    if (!meme) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="top-0 left-0 h-full w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-black/95 p-0 sm:top-[50%] sm:left-[50%] sm:h-auto sm:w-full sm:max-w-5xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:gap-4 sm:rounded-lg sm:border sm:border-neutral-800 sm:bg-black/90 sm:p-4">
                {meme.type === "video" ? (
                    <video
                        src={meme.media_url}
                        controls
                        className="h-full w-full object-contain bg-black sm:h-auto sm:max-h-[80vh] sm:rounded-lg"
                    />
                ) : (
                    <img
                        src={meme.media_url}
                        alt={meme.title}
                        className="h-full w-full object-contain bg-black sm:h-auto sm:max-h-[80vh] sm:rounded-lg"
                    />
                )}

                <button
                    type="button"
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-black/60 p-2 text-white transition disabled:opacity-40"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!hasNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-black/60 p-2 text-white transition disabled:opacity-40"
                >
                    <ChevronRight size={20} />
                </button>
            </DialogContent>
        </Dialog>
    );
}
