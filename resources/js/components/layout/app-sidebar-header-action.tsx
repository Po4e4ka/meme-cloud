import { cn } from "@/lib/utils";
import { HeaderAction } from "@/types";
import { router } from "@inertiajs/react";


export function AppSidebarHeaderAction({Icon, isActive, target_url}: HeaderAction) {
    return (<button
        onClick={() => router.visit(target_url)}
        className={cn(
            "inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm transition",
            "border border-transparent hover:border-foreground/10",
            isActive ? "bg-foreground/10 text-foreground" : "text-muted-foreground"
        )}
    >
        <Icon size={12} />
    </button>
)}
