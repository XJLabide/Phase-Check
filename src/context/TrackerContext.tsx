'use client';

import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useToast } from '@/context/ToastContext';
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

    // Auth
    user: User | null;
    isLoading: boolean;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
    const allContent = useMemo(() => getAllContent(), []);
    const { showToast } = useToast();

    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Local Storage (Fallback)
    const [localProgress, setLocalProgress] = useLocalStorage<WatchProgress>('mcu-progress', {});
    const [localPreferences, setLocalPreferences] = useLocalStorage<UserPreferences>('mcu-preferences', {
        watchOrder: 'release',
    });
    const [localFilters, setLocalFilters] = useLocalStorage<FilterOptions>('mcu-filters', {});

    // Active State (either from Firebase or Local)
    const [progress, setProgressState] = useState<WatchProgress>({});
    const [preferences, setPreferencesState] = useState<UserPreferences>({ watchOrder: 'release' });
    const [filters, setFiltersState] = useState<FilterOptions>({});

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setIsLoading(true);

            if (currentUser) {
                // User logged in - Sync with Firestore
                const userRef = doc(db, 'users', currentUser.uid);

                // Realtime subscription
                const unsubDoc = onSnapshot(
                    userRef,
                    (docSnap) => {
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            setProgressState(data.progress || {});
                            setPreferencesState(data.preferences || { watchOrder: 'release' });
                            setFiltersState(data.filters || {});
                        } else {
                            // New user document - Initialize with empty or local state?
                            // For now, let's keep it empty to allow "clean slate" on cloud
                            // OR we could merge local state here if we wanted "guest -> user" migration
                        }
                        setIsLoading(false);
                    },
                    (error) => {
                        // Handle permission errors gracefully (e.g., user logged out mid-session)
                        console.warn('Firestore subscription error:', error.code);
                        setProgressState(localProgress);
                        setPreferencesState(localPreferences);
                        setFiltersState(localFilters);
                        setIsLoading(false);
                    }
                );

                return () => unsubDoc();
            } else {
                // User logged out - Switch to Local Storage
                setProgressState(localProgress);
                setPreferencesState(localPreferences);
                setFiltersState(localFilters);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [localProgress, localPreferences, localFilters]);

    // Sync helpers
    const updateProgress = useCallback(async (newProgress: WatchProgress) => {
        setProgressState(newProgress);

        if (user) {
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    progress: newProgress,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
            } catch (error) {
                console.error('Error saving progress:', error);
                showToast('Failed to save progress', 'success'); // Using success style for error to handle toast type limitation if any
            }
        } else {
            setLocalProgress(newProgress);
        }
    }, [user, setLocalProgress, showToast]);

    const updatePreferences = useCallback(async (newPreferences: UserPreferences) => {
        setPreferencesState(newPreferences);

        if (user) {
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    preferences: newPreferences
                }, { merge: true });
            } catch (error) {
                console.error('Error saving preferences:', error);
            }
        } else {
            setLocalPreferences(newPreferences);
        }
    }, [user, setLocalPreferences]);

    const updateFilters = useCallback(async (newFilters: FilterOptions) => {
        setFiltersState(newFilters);

        if (user) {
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    filters: newFilters
                }, { merge: true });
            } catch (error) {
                console.error('Error saving filters:', error);
            }
        } else {
            setLocalFilters(newFilters);
        }
    }, [user, setLocalFilters]);


    // Watch order
    const watchOrder = preferences.watchOrder;
    const setWatchOrder = useCallback((order: WatchOrderType) => {
        updatePreferences({ ...preferences, watchOrder: order });
    }, [updatePreferences, preferences]);

    const setFilters = useCallback((newFilters: FilterOptions) => {
        updateFilters(newFilters);
    }, [updateFilters]);

    // Toggle status through: not_started -> watching -> completed -> not_started
    const toggleStatus = useCallback((contentId: string) => {
        const current = progress[contentId] || 'not_started';
        let next: WatchStatus;

        // Find content type to determine flow
        const content = allContent.find(c => c.id === contentId);

        if (content?.type === 'series') {
            switch (current) {
                case 'not_started': next = 'watching'; break;
                case 'watching': next = 'completed'; break;
                case 'completed': next = 'not_started'; break;
                default: next = 'not_started';
            }
        } else {
            switch (current) {
                case 'not_started': next = 'completed'; break;
                case 'completed': next = 'not_started'; break;
                default: next = 'completed';
            }
        }

        updateProgress({ ...progress, [contentId]: next });
    }, [progress, allContent, updateProgress]);

    // Set specific status
    const setStatus = useCallback((contentId: string, status: WatchStatus) => {
        updateProgress({ ...progress, [contentId]: status });
    }, [progress, updateProgress]);

    // Reset all progress
    const resetProgress = useCallback(() => {
        updateProgress({});
    }, [updateProgress]);

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
        user,
        isLoading
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
