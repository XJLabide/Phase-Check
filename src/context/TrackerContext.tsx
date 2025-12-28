'use client';

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
    MCUContent,
    WatchProgress,
    WatchStatus,
    WatchOrderType,
    UserPreferences,
    FilterOptions,
    ProgressStats,
    Phase
} from '@/lib/types';
import {
    getAllContent,
    sortByOrder,
    filterContent,
    getNextToWatch,
    calculateProgress,
    getContentByPhase
} from '@/lib/utils';

interface TrackerContextType {
    // Content
    allContent: MCUContent[];
    displayedContent: MCUContent[];
    contentByPhase: Record<Phase, MCUContent[]>;

    // Progress
    progress: WatchProgress;
    stats: ProgressStats;
    nextToWatch: MCUContent | null;

    // Preferences
    watchOrder: WatchOrderType;
    setWatchOrder: (order: WatchOrderType) => void;
    filters: FilterOptions;
    setFilters: (filters: FilterOptions) => void;

    // Actions
    toggleStatus: (contentId: string) => void;
    setStatus: (contentId: string, status: WatchStatus) => void;
    resetProgress: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
    const allContent = useMemo(() => getAllContent(), []);

    // Persisted state
    const [progress, setProgress] = useLocalStorage<WatchProgress>('mcu-progress', {});
    const [preferences, setPreferences] = useLocalStorage<UserPreferences>('mcu-preferences', {
        watchOrder: 'release',
    });
    const [filters, setFilters] = useLocalStorage<FilterOptions>('mcu-filters', {});

    // Watch order
    const watchOrder = preferences.watchOrder;
    const setWatchOrder = useCallback((order: WatchOrderType) => {
        setPreferences(prev => ({ ...prev, watchOrder: order }));
    }, [setPreferences]);

    // Toggle status through: not_started -> watching -> completed -> not_started
    const toggleStatus = useCallback((contentId: string) => {
        setProgress(prev => {
            const current = prev[contentId] || 'not_started';
            let next: WatchStatus;

            // Find content type to determine flow
            const content = allContent.find(c => c.id === contentId);

            if (content?.type === 'series') {
                // For series: not_started -> watching -> completed -> not_started
                switch (current) {
                    case 'not_started':
                        next = 'watching';
                        break;
                    case 'watching':
                        next = 'completed';
                        break;
                    case 'completed':
                        next = 'not_started';
                        break;
                    default:
                        next = 'not_started';
                }
            } else {
                // For movies/specials: not_started -> completed -> not_started
                switch (current) {
                    case 'not_started':
                        next = 'completed';
                        break;
                    case 'completed':
                        next = 'not_started';
                        break;
                    default:
                        next = 'completed';
                }
            }

            return { ...prev, [contentId]: next };
        });
    }, [setProgress, allContent]);

    // Set specific status
    const setStatus = useCallback((contentId: string, status: WatchStatus) => {
        setProgress(prev => ({ ...prev, [contentId]: status }));
    }, [setProgress]);

    // Reset all progress
    const resetProgress = useCallback(() => {
        setProgress({});
    }, [setProgress]);

    // Computed values
    const displayedContent = useMemo(() => {
        const sorted = sortByOrder(allContent, watchOrder, preferences.customOrder);
        return filterContent(sorted, progress, filters);
    }, [allContent, watchOrder, preferences.customOrder, progress, filters]);

    const contentByPhase = useMemo(() => {
        const sorted = sortByOrder(allContent, watchOrder, preferences.customOrder);
        return getContentByPhase(sorted);
    }, [allContent, watchOrder, preferences.customOrder]);

    const stats = useMemo(() => {
        return calculateProgress(allContent, progress);
    }, [allContent, progress]);

    const nextToWatch = useMemo(() => {
        return getNextToWatch(allContent, progress, watchOrder, preferences.customOrder);
    }, [allContent, progress, watchOrder, preferences.customOrder]);

    const value: TrackerContextType = {
        allContent,
        displayedContent,
        contentByPhase,
        progress,
        stats,
        nextToWatch,
        watchOrder,
        setWatchOrder,
        filters,
        setFilters,
        toggleStatus,
        setStatus,
        resetProgress,
    };

    return (
        <TrackerContext.Provider value={value}>
            {children}
        </TrackerContext.Provider>
    );
}

export function useTracker() {
    const context = useContext(TrackerContext);
    if (!context) {
        throw new Error('useTracker must be used within a TrackerProvider');
    }
    return context;
}
