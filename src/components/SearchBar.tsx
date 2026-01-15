'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Film, Tv, Star } from 'lucide-react';
import { useTracker } from '@/context/TrackerContext';
import { MCUContent } from '@/lib/types';

interface SearchBarProps {
    onSelect?: (content: MCUContent) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { allContent, progress, toggleStatus } = useTracker();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter content based on search query
    const results = query.trim().length > 0
        ? allContent.filter(c =>
            c.title.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
        : [];

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcut: Cmd/Ctrl + K to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSelect = (content: MCUContent) => {
        toggleStatus(content.id);
        setQuery('');
        setIsOpen(false);
        if (onSelect) onSelect(content);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'movie': return <Film className="w-4 h-4" />;
            case 'series': return <Tv className="w-4 h-4" />;
            default: return <Star className="w-4 h-4" />;
        }
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search titles... (⌘K)"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full pl-10 pr-10 py-2 bg-[#06090d] border border-[#1c2128] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#e53935] transition-colors"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1117] border border-[#1c2128] rounded-lg shadow-xl overflow-hidden z-50">
                    {results.map((content) => {
                        const status = progress[content.id] || 'not_started';
                        return (
                            <button
                                key={content.id}
                                onClick={() => handleSelect(content)}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1c2128] transition-colors text-left"
                            >
                                {/* Poster thumbnail */}
                                <div className="w-8 h-12 rounded overflow-hidden flex-shrink-0 bg-[#1c2128]">
                                    {content.poster && (
                                        <img src={content.poster} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${status === 'completed' ? 'text-gray-500 line-through' : 'text-white'
                                        }`}>
                                        {content.title}
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                        {getTypeIcon(content.type)}
                                        <span>Phase {content.phase}</span>
                                    </p>
                                </div>

                                {/* Status */}
                                <span className={`text-xs px-2 py-1 rounded ${status === 'completed' ? 'bg-[#22c55e]/20 text-[#22c55e]' :
                                        status === 'watching' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-[#1c2128] text-gray-400'
                                    }`}>
                                    {status === 'completed' ? 'Watched' : status === 'watching' ? 'Watching' : 'Not started'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* No results */}
            {isOpen && query.trim().length > 0 && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1117] border border-[#1c2128] rounded-lg shadow-xl p-4 text-center text-gray-500 text-sm z-50">
                    No titles found for "{query}"
                </div>
            )}
        </div>
    );
}
