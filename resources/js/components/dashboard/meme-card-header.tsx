import { MoreVertical, Edit2, Trash2, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import MemeCardMenuButton from "@/components/dashboard/meme-card-menu-button";
import { InternalApi } from "@/api";

export type MemeCardHeaderProps = {
    isHovered: boolean,
    memeId: number,
};

export default function MemeCardHeader({isHovered, memeId}: MemeCardHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!isHovered) {
            setIsMenuOpen(false);
        }
    }, [isHovered]);

    const internalApi = (new InternalApi).v1().meme()

    const handleTrashButton = async (e: React.MouseEvent) => {
        e.stopPropagation()
        await internalApi.delete(memeId);
    }

    return (
        <div
            className={`absolute top-0 left-0 w-full h-15% bg-black/40 backdrop-blur-sm flex justify-end items-start px-2 transition-transform duration-300 ${
                isHovered ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(true);
                }}
                className={`text-white p-2 hover:bg-white/20 rounded-full mt-1 transition-opacity duration-200 ${
                    isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            >
                <MoreVertical size={12}/>
            </button>

            <div
                className={`flex items-center gap-2 pr-2 transition-all duration-300 ${
                    isMenuOpen
                        ? "translate-x-0 opacity-100"
                        : "translate-x-10 opacity-0 pointer-events-none"
                }`}
            >
                <MemeCardMenuButton Icon={Edit2}  onClick={(e) => e.stopPropagation()} />
                <MemeCardMenuButton Icon={Trash2} onClick={handleTrashButton} />
                <MemeCardMenuButton Icon={Share2} onClick={(e) => e.stopPropagation()} />
            </div>
        </div>
    );
}
