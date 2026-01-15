import { Achievement, Phase } from '@/lib/types';

// Achievement definitions
export const achievementDefinitions: Omit<Achievement, 'unlockedAt'>[] = [
    {
        id: 'first-watch',
        title: 'First Steps',
        description: 'Complete your first MCU title',
        icon: '🎬',
    },
    {
        id: 'phase-1-complete',
        title: 'Origin Story',
        description: 'Complete all of Phase 1',
        icon: '🦸',
    },
    {
        id: 'phase-2-complete',
        title: 'Age of Heroes',
        description: 'Complete all of Phase 2',
        icon: '⚡',
    },
    {
        id: 'phase-3-complete',
        title: 'Infinity Quest',
        description: 'Complete all of Phase 3',
        icon: '💎',
    },
    {
        id: 'phase-4-complete',
        title: 'New Beginnings',
        description: 'Complete all of Phase 4',
        icon: '🌌',
    },
    {
        id: 'phase-5-complete',
        title: 'Multiverse Explorer',
        description: 'Complete all of Phase 5',
        icon: '🌀',
    },
    {
        id: 'infinity-saga-complete',
        title: 'Infinity Saga Complete',
        description: 'Complete the entire Infinity Saga (Phases 1-3)',
        icon: '♾️',
    },
    {
        id: 'all-movies',
        title: 'Film Buff',
        description: 'Watch all MCU movies',
        icon: '🎞️',
    },
    {
        id: 'all-series',
        title: 'Binge Watcher',
        description: 'Watch all MCU series',
        icon: '📺',
    },
    {
        id: 'all-specials',
        title: 'Special Collector',
        description: 'Watch all MCU specials',
        icon: '⭐',
    },
    {
        id: 'completionist',
        title: 'True Believer',
        description: 'Complete everything in the MCU',
        icon: '🏆',
    },
    {
        id: 'halfway-there',
        title: 'Halfway There',
        description: 'Complete 50% of all MCU content',
        icon: '🎯',
    },
    {
        id: 'marathon-starter',
        title: 'Marathon Starter',
        description: 'Watch 10 titles',
        icon: '🏃',
    },
    {
        id: 'avengers-assembled',
        title: 'Avengers Assembled',
        description: 'Watch all Avengers movies',
        icon: '🅰️',
    },
];

// Phase completion achievement IDs
export const phaseAchievementMap: Record<Phase, string> = {
    1: 'phase-1-complete',
    2: 'phase-2-complete',
    3: 'phase-3-complete',
    4: 'phase-4-complete',
    5: 'phase-5-complete',
    6: 'phase-6-complete', // Future
};

// Get achievement by ID
export function getAchievement(id: string): Omit<Achievement, 'unlockedAt'> | undefined {
    return achievementDefinitions.find(a => a.id === id);
}
