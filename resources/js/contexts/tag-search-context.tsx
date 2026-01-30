import { createContext, type ReactNode, useContext } from 'react';

type TagSearchContextValue = {
    availableTags: string[];
    selectedTags: string[];
};

const TagSearchContext = createContext<TagSearchContextValue | null>(null);

export function TagSearchProvider({
    availableTags,
    selectedTags,
    children,
}: TagSearchContextValue & { children: ReactNode }) {
    return (
        <TagSearchContext.Provider value={{ availableTags, selectedTags }}>
            {children}
        </TagSearchContext.Provider>
    );
}

export function useTagSearchContext() {
    const context = useContext(TagSearchContext);
    if (!context) {
        return { availableTags: [], selectedTags: [] };
    }
    return context;
}
