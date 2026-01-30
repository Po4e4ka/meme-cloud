import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { useTagSearchContext } from '@/contexts/tag-search-context';

export function TagSearchInput() {
    const { availableTags, selectedTags } = useTagSearchContext();
    const [tagInput, setTagInput] = useState("");
    const [activeTags, setActiveTags] = useState<string[]>(selectedTags ?? []);
    const [isFocused, setIsFocused] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState((selectedTags ?? []).length > 0);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setActiveTags(selectedTags ?? []);
        if ((selectedTags ?? []).length > 0) {
            setIsSearchOpen(true);
        }
    }, [selectedTags?.join('|')]);

    const suggestions = useMemo(() => {
        const query = tagInput.trim().toLowerCase();
        const filtered = availableTags.filter((tag) => !activeTags.includes(tag));

        if (!query) {
            return filtered.slice(0, 8);
        }

        return filtered
            .filter((tag) => tag.toLowerCase().includes(query))
            .slice(0, 8);
    }, [activeTags, availableTags, tagInput]);

    useEffect(() => {
        if (highlightIndex >= suggestions.length && suggestions.length > 0) {
            setHighlightIndex(0);
        }
    }, [highlightIndex, suggestions.length]);

    const applyFilter = (nextTags: string[]) => {
        const query = nextTags.length > 0 ? { tags: nextTags } : {};

        router.get(route('dashboard'), query, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const addTag = (tag: string) => {
        const value = tag.trim();
        if (!value || activeTags.includes(value)) {
            setTagInput("");
            return;
        }

        const nextTags = [...activeTags, value];
        setActiveTags(nextTags);
        setTagInput("");
        applyFilter(nextTags);
    };

    const removeTag = (tag: string) => {
        const nextTags = activeTags.filter((t) => t !== tag);
        setActiveTags(nextTags);
        applyFilter(nextTags);
    };

    const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            if (activeTags.length === 0 && tagInput.trim() === '') {
                setIsSearchOpen(false);
            }
            return;
        }

        if (event.key === 'Backspace' && tagInput.trim() === '') {
            if (activeTags.length > 0) {
                event.preventDefault();
                removeTag(activeTags[activeTags.length - 1]);
            }
            return;
        }

        if (event.key === 'Tab' && suggestions.length > 0) {
            event.preventDefault();
            const delta = event.shiftKey ? -1 : 1;
            const nextIndex = (highlightIndex + delta + suggestions.length) % suggestions.length;
            setHighlightIndex(nextIndex);
            return;
        }

        if (event.key !== 'Enter') return;

        event.preventDefault();
        if (suggestions.length === 0) return;
        const match = suggestions[highlightIndex] ?? suggestions[0];
        if (match) addTag(match);
    };

    const openSearch = () => {
        setIsSearchOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (activeTags.length === 0 && tagInput.trim() === '') {
            setIsSearchOpen(false);
        }
    };

    const ghostSuffix = useMemo(() => {
        const value = tagInput;
        if (!value) return '';
        const candidate = suggestions[highlightIndex] ?? suggestions[0];
        if (!candidate) return '';
        if (!candidate.toLowerCase().startsWith(value.toLowerCase())) return '';
        return candidate.slice(value.length);
    }, [highlightIndex, suggestions, tagInput]);

    return (<div className="relative">
        <div
            className={[
                'flex items-center overflow-hidden rounded-xl transition-all duration-300',
                isSearchOpen
                    ? 'w-[220px] px-2 py-1 sm:w-[320px] border border-foreground/10 bg-foreground/5'
                    : 'w-9 px-0 py-0 border border-transparent bg-transparent'
            ].join(' ')}
        >
            <button
                type="button"
                onClick={openSearch}
                className="flex h-9 w-9 items-center justify-center text-muted-foreground transition hover:text-foreground"
            >
                <Search size={16} />
            </button>
            <div
                className={`flex flex-1 flex-wrap items-center gap-2 transition-opacity duration-200 ${isSearchOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
                {activeTags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                    >
                        {tag}
                        <button
                            type="button"
                            className="text-emerald-700/70 hover:text-emerald-800"
                            onClick={() => removeTag(tag)}
                        >
                            ×
                        </button>
                    </span>
                ))}
                <div className="relative flex min-w-[120px] flex-1 items-center">
                    {ghostSuffix && (
                        <span
                            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/60">
                                <span className="invisible">{tagInput}</span>
                            {ghostSuffix}
                            </span>
                    )}
                    <input
                        ref={inputRef}
                        value={tagInput}
                        onChange={(event) => {
                            setTagInput(event.target.value);
                            setHighlightIndex(0);
                        }}
                        onKeyDown={handleTagKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                        placeholder={availableTags.length ? 'Тег' : 'Нет тегов'}
                        className="h-8 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                        disabled={availableTags.length === 0}
                    />
                </div>
            </div>
        </div>
        {isSearchOpen && isFocused && suggestions.length > 0 && (
            <div
                className="absolute right-0 top-full z-20 mt-2 w-[220px] sm:w-[320px]"
                onMouseDown={(event) => event.preventDefault()}
            >
                <div className="rounded-2xl border border-border/70 bg-background p-2 shadow-lg">
                    <div className="text-xs text-muted-foreground px-2 py-1">Возможные теги</div>
                    <div className="flex flex-wrap gap-2 px-2 pb-2">
                        {suggestions.map((tag, index) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => addTag(tag)}
                                onMouseEnter={() => setHighlightIndex(index)}
                                className={[
                                    'rounded-full border px-3 py-1 text-xs font-medium text-foreground transition',
                                    index === highlightIndex
                                        ? 'border-foreground/20 bg-foreground/15'
                                        : 'border-foreground/10 bg-foreground/5 hover:bg-foreground/10'
                                ].join(' ')}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>);
}
