import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, HeaderAction } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { MemeCardProps } from "@/components/dashboard/meme-card";
import MemeCardContainer from "@/components/dashboard/meme-card-container";
import { Plus, WifiOff } from "lucide-react";
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Мемчики',
        href: '/',
    }
];

const actions: HeaderAction[] = [
    {
        Icon: Plus,
        target_url: "/memes/new",
        isActive: false
    }
]

export default function Dashboard() {
    const { memes } = usePage<{ memes: MemeCardProps[] }>().props;
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const updateStatus = () => setIsOnline(navigator.onLine);
        updateStatus();

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} actions={actions}>
            <Head title="Meme Cloud" />
                {!isOnline && (
                    <div className="mx-4 mb-4 rounded-2xl border border-amber-200/70 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                <WifiOff className="h-5 w-5" />
                            </span>
                            <div className="text-sm">
                                <div className="font-semibold">Нет соединения</div>
                                <div className="text-amber-800/80">Показываем сохранённые мемы и медиа.</div>
                            </div>
                        </div>
                    </div>
                )}
                <MemeCardContainer memes={memes} />
        </AppLayout>
    );
}
