import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/layout/app-sidebar-header';
import { type BreadcrumbItem, type HeaderAction } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    actions = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; actions?: HeaderAction[]}>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} actions={actions} />
                {children}
            </AppContent>
        </AppShell>
    );
}
