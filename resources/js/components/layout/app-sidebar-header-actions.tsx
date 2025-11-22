import { HeaderAction } from "@/types";
import { AppSidebarHeaderAction } from "@/components/layout/app-sidebar-header-action";

interface ActionsProps {
    actions?: HeaderAction[];
}

export function AppSidebarHeaderActions({ actions = [] }: ActionsProps) {
    return (
        <div className="flex items-center gap-2">
            {actions.map((action: HeaderAction) => (
                <AppSidebarHeaderAction
                    isActive={action.isActive}
                    Icon={action.Icon}
                    target_url={action.target_url}
                />
            ))}
        </div>
    );
}
