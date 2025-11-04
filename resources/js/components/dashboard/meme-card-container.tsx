import MemeCard, {MemeCardProps} from "@/components/dashboard/meme-card";

export type MemeCardContainerProps = {
    memes: MemeCardProps[]
}

export default function MemeCardContainer({ memes }: MemeCardContainerProps) {
    return (
        <div className="flex justify-center p-4">
            <div className="flex flex-wrap gap-4 max-w-screen-lg">
                {memes.map((meme) => (
                    <MemeCard id={meme.id} title={meme.title} image_url={meme.image_url} />
                ))}
            </div>
        </div>
    );
}