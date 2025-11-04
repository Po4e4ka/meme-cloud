import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { MemeCardProps } from "@/components/dashboard/meme-card";
import MemeCardContainer from "@/components/dashboard/meme-card-container";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/',
    },
];

export default function Dashboard() {
    const { memes } = usePage<{ memes: MemeCardProps[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meme Cloud" />
                <MemeCardContainer memes={memes} />
        </AppLayout>
    );
}
