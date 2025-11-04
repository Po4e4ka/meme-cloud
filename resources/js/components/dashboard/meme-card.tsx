import { useState } from "react";
import MemeCardHeader from "@/components/dashboard/meme-card-header";
import MemeCardFooter from "@/components/dashboard/meme-card-footer";

export type MemeCardProps = {
    id: number;
    title: string;
    image_url: string;
};

export default function MemeCard({ id, title, image_url }: MemeCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            key={id}
            className="relative w-[200px] h-[260px] overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-neutral-50 dark:bg-neutral-900"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
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
