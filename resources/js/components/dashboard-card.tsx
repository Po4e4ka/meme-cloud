export type MemeCardProps = {
    id: number;
    title: string;
    image_url: string;
}

export default function MemeCard({ id, title, image_url }: MemeCardProps) {
    return (
        <div
            key={id}
            className="relative w-[200px] h-[260px] overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-neutral-50 dark:bg-neutral-900"
        >
            <img
                src={image_url}
                alt={title}
                className="w-full h-full object-cover"
            />
        </div>
    );
}