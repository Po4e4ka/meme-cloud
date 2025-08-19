import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import UploadForm from "@/pages/files/upload";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/',
    },
];

type Meme = {
    id: number;
    title: string;
    image_url: string;
};

export default function Dashboard() {
    const { memes } = usePage<{ memes: Meme[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meme Cloud" />
            <UploadForm />
            {/* Контейнер с карточками */}
            <div className="flex justify-center p-4">
                <div className="flex flex-wrap gap-4 max-w-screen-lg">
                    {memes.map((meme) => (
                        <div
                            key={meme.id}
                            className="relative w-[200px] h-[260px] overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-neutral-50 dark:bg-neutral-900"
                        >
                            <img
                                src={meme.image_url}
                                alt={meme.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
