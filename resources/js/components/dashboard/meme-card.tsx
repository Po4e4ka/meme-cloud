import { useState } from "react";
import MemeCardHeader from "@/components/dashboard/meme-card-header";
import MemeCardFooter from "@/components/dashboard/meme-card-footer";

export type MemeCardProps = {
    id: number;
    title: string;
    image_url: string;
    media_url: string;
    type: string;
};

type MemeCardActions = {
    onOpen: () => void;
};

export default function MemeCard({ id, title, image_url, onOpen }: MemeCardProps & MemeCardActions) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            key={id}
            className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl border border-gray-300 dark:border-gray-700 bg-neutral-50 dark:bg-neutral-900 cursor-pointer sm:h-[258px] sm:aspect-auto sm:rounded-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
            onClick={onOpen}
        >
            <img
                src={image_url}
                alt={title}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                    isHovered ? "scale-105" : ""
                }`}
            />

            <MemeCardHeader isHovered={isHovered} memeId={id}/>
            <MemeCardFooter isHovered={isHovered} title={title}/>
        </div>
    );
}
