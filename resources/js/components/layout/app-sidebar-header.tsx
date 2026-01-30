import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, HeaderAction } from '@/types';
import { AppSidebarHeaderActions } from "@/components/layout/app-sidebar-header-actions";

export function AppSidebarHeader({
    breadcrumbs = [],
    actions = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
    actions?: HeaderAction[];
}) {
    return (
        <header className="flex min-h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 py-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <AppSidebarHeaderActions actions={actions}/>
            </div>
        </header>
    );
}
