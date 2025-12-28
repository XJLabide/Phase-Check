'use client';

import { useState } from 'react';
import { useTracker } from '@/context/TrackerContext';
import { Phase, ContentType, WatchStatus, Saga } from '@/lib/types';
import { Filter, X, Film, Tv, Star, CheckCircle2, Circle, PlayCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FilterBar() {
    const { filters, setFilters } = useTracker();
    const [isOpen, setIsOpen] = useState(false);

    const hasActiveFilters =
        (filters.phases && filters.phases.length > 0) ||
        (filters.types && filters.types.length > 0) ||
        (filters.status && filters.status.length > 0) ||
        (filters.sagas && filters.sagas.length > 0);

    const activeCount =
        (filters.phases?.length || 0) +
        (filters.types?.length || 0) +
        (filters.status?.length || 0) +
        (filters.sagas?.length || 0);

    const togglePhase = (phase: Phase) => {
        const current = filters.phases || [];
        const updated = current.includes(phase)
            ? current.filter(p => p !== phase)
            : [...current, phase];
        setFilters({ ...filters, phases: updated.length > 0 ? updated : undefined });
    };

    const toggleType = (type: ContentType) => {
        const current = filters.types || [];
        const updated = current.includes(type)
            ? current.filter(t => t !== type)
            : [...current, type];
        setFilters({ ...filters, types: updated.length > 0 ? updated : undefined });
    };

    const toggleStatus = (status: WatchStatus) => {
        const current = filters.status || [];
        const updated = current.includes(status)
            ? current.filter(s => s !== status)
            : [...current, status];
        setFilters({ ...filters, status: updated.length > 0 ? updated : undefined });
    };

    const toggleSaga = (saga: Saga) => {
        const current = filters.sagas || [];
        const updated = current.includes(saga)
            ? current.filter(s => s !== saga)
            : [...current, saga];
        setFilters({ ...filters, sagas: updated.length > 0 ? updated : undefined });
    };

    const clearFilters = () => {
        setFilters({});
    };

    const phases: Phase[] = [1, 2, 3, 4, 5, 6];
    const types: { type: ContentType; label: string; icon: React.ReactNode }[] = [
        { type: 'movie', label: 'Movies', icon: <Film className="w-3.5 h-3.5" /> },
        { type: 'series', label: 'Series', icon: <Tv className="w-3.5 h-3.5" /> },
        { type: 'special', label: 'Specials', icon: <Star className="w-3.5 h-3.5" /> },
    ];
    const statuses: { status: WatchStatus; label: string; icon: React.ReactNode }[] = [
        { status: 'not_started', label: 'Unwatched', icon: <Circle className="w-3.5 h-3.5" /> },
        { status: 'watching', label: 'Watching', icon: <PlayCircle className="w-3.5 h-3.5" /> },
        { status: 'completed', label: 'Done', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="glass-card overflow-hidden h-full">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-text-muted" />
                    <span className="text-sm font-medium">Filters</span>
                    {hasActiveFilters && (
                        <span className="px-1.5 py-0.5 rounded bg-foreground text-background text-[10px] font-bold min-w-[18px] text-center">
                            {activeCount}
                        </span>
                    )}
                </div>
                <ChevronDown className={cn(
                    "w-4 h-4 text-text-muted transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            {/* Filter Panel */}
            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="p-3 sm:p-4 pt-0 space-y-3">
                    {/* Clear Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-xs text-text-secondary hover:text-foreground"
                        >
                            <X className="w-3.5 h-3.5" />
                            Clear all
                        </button>
                    )}

                    {/* Saga & Type Row */}
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            onClick={() => toggleSaga('infinity')}
                            className={cn(
                                'px-2 py-1 rounded text-xs font-medium transition-all',
                                filters.sagas?.includes('infinity')
                                    ? 'bg-foreground text-background'
                                    : 'bg-surface text-text-muted hover:text-foreground'
                            )}
                        >
                            Infinity
                        </button>
                        <button
                            onClick={() => toggleSaga('multiverse')}
                            className={cn(
                                'px-2 py-1 rounded text-xs font-medium transition-all',
                                filters.sagas?.includes('multiverse')
                                    ? 'bg-foreground text-background'
                                    : 'bg-surface text-text-muted hover:text-foreground'
                            )}
                        >
                            Multiverse
                        </button>

                        <div className="w-px h-5 bg-white/10 mx-1" />

                        {types.map(({ type, label, icon }) => (
                            <button
                                key={type}
                                onClick={() => toggleType(type)}
                                className={cn(
                                    'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all',
                                    filters.types?.includes(type)
                                        ? 'bg-foreground text-background'
                                        : 'bg-surface text-text-muted hover:text-foreground'
                                )}
                            >
                                {icon}
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Phase Filter */}
                    <div>
                        <h4 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1.5">
                            Phase
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {phases.map((phase) => (
                                <button
                                    key={phase}
                                    onClick={() => togglePhase(phase)}
                                    className={cn(
                                        'w-8 h-8 rounded text-xs font-medium transition-all',
                                        filters.phases?.includes(phase)
                                            ? 'bg-foreground text-background'
                                            : 'bg-surface text-text-muted hover:text-foreground'
                                    )}
                                >
                                    {phase}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <h4 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1.5">
                            Status
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {statuses.map(({ status, label, icon }) => (
                                <button
                                    key={status}
                                    onClick={() => toggleStatus(status)}
                                    className={cn(
                                        'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all',
                                        filters.status?.includes(status)
                                            ? 'bg-foreground text-background'
                                            : 'bg-surface text-text-muted hover:text-foreground'
                                    )}
                                >
                                    {icon}
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
