import { MCUContent, WatchProgress, Phase, Saga, WatchOrderType, ProgressStats, FilterOptions, WatchStatus } from './types';
import mcuData from '@/data/mcu-content.json';

// Get all MCU content
export function getAllContent(): MCUContent[] {
    return mcuData.content as MCUContent[];
}

// Sort content by watch order
export function sortByOrder(content: MCUContent[], order: WatchOrderType, customOrder?: string[]): MCUContent[] {
    if (order === 'custom' && customOrder) {
        return [...content].sort((a, b) => {
            const indexA = customOrder.indexOf(a.id);
            const indexB = customOrder.indexOf(b.id);
            return indexA - indexB;
        });
    }

    const orderKey = order === 'release' ? 'releaseOrder' : 'chronologicalOrder';
    return [...content].sort((a, b) => a[orderKey] - b[orderKey]);
}

// Filter content based on options
export function filterContent(content: MCUContent[], progress: WatchProgress, filters: FilterOptions): MCUContent[] {
    return content.filter(item => {
        if (filters.phases && filters.phases.length > 0 && !filters.phases.includes(item.phase)) {
            return false;
        }
        if (filters.sagas && filters.sagas.length > 0 && !filters.sagas.includes(item.saga)) {
            return false;
        }
        if (filters.types && filters.types.length > 0 && !filters.types.includes(item.type)) {
            return false;
        }
        if (filters.status && filters.status.length > 0) {
            const itemStatus = progress[item.id] || 'not_started';
            if (!filters.status.includes(itemStatus)) {
                return false;
            }
        }
        return true;
    });
}

// Get the next item to watch
export function getNextToWatch(content: MCUContent[], progress: WatchProgress, order: WatchOrderType, customOrder?: string[]): MCUContent | null {
    const sorted = sortByOrder(content, order, customOrder);

    // First, check for items currently being watched
    const watching = sorted.find(item => progress[item.id] === 'watching');
    if (watching) return watching;

    // Then find the first unwatched item
    const nextUnwatched = sorted.find(item => {
        const status = progress[item.id] || 'not_started';
        return status === 'not_started';
    });

    return nextUnwatched || null;
}

// Calculate progress statistics
export function calculateProgress(content: MCUContent[], progress: WatchProgress): ProgressStats {
    const total = content.length;
    const completed = content.filter(item => progress[item.id] === 'completed').length;

    // Calculate by phase
    const byPhase: Record<Phase, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const phaseTotal: Record<Phase, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    content.forEach(item => {
        phaseTotal[item.phase]++;
        if (progress[item.id] === 'completed') {
            byPhase[item.phase]++;
        }
    });

    // Convert to percentages
    const byPhasePercentage: Record<Phase, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    (Object.keys(byPhase) as unknown as Phase[]).forEach(phase => {
        byPhasePercentage[phase] = phaseTotal[phase] > 0
            ? Math.round((byPhase[phase] / phaseTotal[phase]) * 100)
            : 0;
    });

    // Calculate by saga
    const bySaga: Record<Saga, number> = { infinity: 0, multiverse: 0 };
    const sagaTotal: Record<Saga, number> = { infinity: 0, multiverse: 0 };

    content.forEach(item => {
        sagaTotal[item.saga]++;
        if (progress[item.id] === 'completed') {
            bySaga[item.saga]++;
        }
    });

    const bySagaPercentage: Record<Saga, number> = {
        infinity: sagaTotal.infinity > 0 ? Math.round((bySaga.infinity / sagaTotal.infinity) * 100) : 0,
        multiverse: sagaTotal.multiverse > 0 ? Math.round((bySaga.multiverse / sagaTotal.multiverse) * 100) : 0,
    };

    return {
        overall: Math.round((completed / total) * 100),
        byPhase: byPhasePercentage,
        bySaga: bySagaPercentage,
        totalCompleted: completed,
        totalItems: total,
        currentStreak: 0, // TODO: Implement streak logic
    };
}

// Get content grouped by phase
export function getContentByPhase(content: MCUContent[]): Record<Phase, MCUContent[]> {
    const result: Record<Phase, MCUContent[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    content.forEach(item => {
        result[item.phase].push(item);
    });

    return result;
}

// Get phase info
export function getPhaseInfo(phase: Phase): { name: string; saga: Saga; description: string } {
    const phases: Record<Phase, { name: string; saga: Saga; description: string }> = {
        1: { name: 'Phase One', saga: 'infinity', description: 'The Avengers Assembled' },
        2: { name: 'Phase Two', saga: 'infinity', description: 'A New World' },
        3: { name: 'Phase Three', saga: 'infinity', description: 'The Infinity Saga' },
        4: { name: 'Phase Four', saga: 'multiverse', description: 'A New Beginning' },
        5: { name: 'Phase Five', saga: 'multiverse', description: 'Multiversal Chaos' },
        6: { name: 'Phase Six', saga: 'multiverse', description: 'Secret Wars' },
    };
    return phases[phase];
}

// Get remaining count for a phase
export function getRemainingInPhase(content: MCUContent[], progress: WatchProgress, phase: Phase): number {
    const phaseContent = content.filter(item => item.phase === phase);
    const completed = phaseContent.filter(item => progress[item.id] === 'completed').length;
    return phaseContent.length - completed;
}

// Format runtime for display
export function formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

// Get status color
export function getStatusColor(status: WatchStatus): string {
    switch (status) {
        case 'completed':
            return 'var(--success)';
        case 'watching':
            return 'var(--secondary)';
        default:
            return 'var(--text-muted)';
    }
}

// CN utility for class names
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
