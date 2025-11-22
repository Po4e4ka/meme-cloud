import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, HeaderAction } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { MemeCardProps } from "@/components/dashboard/meme-card";
import MemeCardContainer from "@/components/dashboard/meme-card-container";
import { Plus } from "lucide-react";

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
    return (
        <AppLayout breadcrumbs={breadcrumbs} actions={actions}>
            <Head title="Meme Cloud" />
                <MemeCardContainer memes={memes} />
        </AppLayout>
    );
}
