import { type LucideIcon } from "lucide-react";
import React from "react";

export type MemeCardMenuButtonProps = {
    onClick: () => (e: React.MouseEvent) => Promise<void>;
    Icon: LucideIcon;
};

export default function MemeCardMenuButton({Icon, onClick}: MemeCardMenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-8 h-8 flex items-center justify-center bg-white/15 hover:bg-white/25 rounded-full text-white transition-all duration-300"
        >
            <Icon size={12} />
        </button>
    );
}
