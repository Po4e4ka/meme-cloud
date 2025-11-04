export type MemeCardFooterProps = {
    isHovered: boolean
    title: string
}

export default function MemeCardFooter({isHovered, title}: MemeCardFooterProps) {

    return (
        <div
            className={`absolute bottom-0 left-0 w-full bg-black/60 text-white text-center text-sm py-2
          transition-transform duration-300 ${isHovered ? "translate-y-0" : "translate-y-full"}`}
        >
            {title}
        </div>
    );
}
