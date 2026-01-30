import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, HeaderAction } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { MemeCardProps } from "@/components/dashboard/meme-card";
import MemeCardContainer from "@/components/dashboard/meme-card-container";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from 'react';
import Offline from '@/pages/offline';
import { TagSearchInput } from '@/components/app-heade-tag-search';
import { TagSearchProvider } from '@/contexts/tag-search-context';

const title: string = 'Meme Space';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Мемчики',
        href: '/',
    }
];

const actions: HeaderAction[] = [
    {
        Icon: Search,
        isActive: false,
        node: TagSearchInput,
    },
    {
        Icon: Plus,
        target_url: "/memes/new",
        isActive: false
    }
]

export default function Dashboard() {
    const { memes, availableTags, selectedTags } = usePage<{
        memes: MemeCardProps[];
        availableTags: string[];
        selectedTags: string[];
    }>().props;
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
        <TagSearchProvider availableTags={availableTags} selectedTags={selectedTags}>
            <AppLayout breadcrumbs={breadcrumbs} actions={actions}>
                <Head title={title} />
                {!isOnline && <Offline /> }
                <MemeCardContainer memes={memes} />
            </AppLayout>
        </TagSearchProvider>
    );
}
