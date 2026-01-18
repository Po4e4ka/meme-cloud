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
            <DialogContent className="max-w-5xl bg-black/90 border border-neutral-800 p-4">
                {meme.type === "video" ? (
                    <video
                        src={meme.media_url}
                        controls
                        className="w-full max-h-[80vh] object-contain rounded-lg bg-black"
                    />
                ) : (
                    <img
                        src={meme.media_url}
                        alt={meme.title}
                        className="w-full max-h-[80vh] object-contain rounded-lg bg-black"
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
