'use client';

import { Achievement } from '@/lib/types';

interface AchievementBadgeProps {
    achievement: Achievement;
    unlocked: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function AchievementBadge({ achievement, unlocked, size = 'md' }: AchievementBadgeProps) {
    const sizeClasses = {
        sm: 'w-10 h-10 text-lg',
        md: 'w-14 h-14 text-2xl',
        lg: 'w-20 h-20 text-4xl',
    };

    return (
        <div className={`group relative ${unlocked ? '' : 'grayscale opacity-50'}`}>
            {/* Badge */}
            <div
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-transform hover:scale-110 ${unlocked
                        ? 'bg-gradient-to-br from-[#e53935] to-[#c62828] shadow-lg shadow-[#e53935]/30'
                        : 'bg-[#1c2128] border border-[#2d333b]'
                    }`}
            >
                <span role="img" aria-label={achievement.title}>
                    {achievement.icon}
                </span>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#0d1117] border border-[#1c2128] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-[150px] text-center">
                <p className="text-sm font-medium text-white">{achievement.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{achievement.description}</p>
                {unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-[#e53935] mt-1">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                )}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1c2128]" />
            </div>
        </div>
    );
}

// Achievement showcase grid
interface AchievementShowcaseProps {
    achievements: Achievement[];
    unlockedIds: string[];
    maxDisplay?: number;
}

export function AchievementShowcase({ achievements, unlockedIds, maxDisplay = 6 }: AchievementShowcaseProps) {
    // Sort: unlocked first, then sort by unlock date (most recent first)
    const sortedAchievements = [...achievements]
        .sort((a, b) => {
            const aUnlocked = unlockedIds.includes(a.id);
            const bUnlocked = unlockedIds.includes(b.id);
            if (aUnlocked && !bUnlocked) return -1;
            if (!aUnlocked && bUnlocked) return 1;
            return 0;
        })
        .slice(0, maxDisplay);

    return (
        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#1c2128]">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Achievements</h3>
                <span className="text-xs text-[#e53935]">
                    {unlockedIds.length}/{achievements.length}
                </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {sortedAchievements.map((achievement) => (
                    <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        unlocked={unlockedIds.includes(achievement.id)}
                        size="sm"
                    />
                ))}
            </div>
        </div>
    );
}
