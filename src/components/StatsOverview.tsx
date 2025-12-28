'use client';

import { useTracker } from '@/context/TrackerContext';
import ProgressBar from './ProgressBar';
import { Trophy, Film, Tv, Star } from 'lucide-react';

export default function StatsOverview() {
    const { stats, allContent, progress } = useTracker();

    const watchingCount = allContent.filter(c => progress[c.id] === 'watching').length;
    const movieCount = allContent.filter(c => c.type === 'movie' && progress[c.id] === 'completed').length;
    const totalMovies = allContent.filter(c => c.type === 'movie').length;
    const seriesCount = allContent.filter(c => c.type === 'series' && progress[c.id] === 'completed').length;
    const totalSeries = allContent.filter(c => c.type === 'series').length;
    const specialCount = allContent.filter(c => c.type === 'special' && progress[c.id] === 'completed').length;
    const totalSpecials = allContent.filter(c => c.type === 'special').length;

    return (
        <div className="glass-card p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-semibold text-text-secondary">Your Progress</h3>
            </div>

            {/* Main Progress */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative w-14 h-14 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="var(--surface)" strokeWidth="3" />
                        <circle
                            cx="18" cy="18" r="14" fill="none"
                            stroke={stats.overall === 100 ? 'var(--success)' : 'var(--text-secondary)'}
                            strokeWidth="3"
                            strokeDasharray={`${stats.overall} 100`}
                            strokeLinecap="round"
                            className="transition-all duration-700 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold">{stats.overall}%</span>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="text-xl font-bold">
                        {stats.totalCompleted}<span className="text-text-muted text-base font-normal">/{stats.totalItems}</span>
                    </div>
                    <p className="text-text-muted text-xs">
                        {watchingCount > 0 ? `${watchingCount} in progress` : 'completed'}
                    </p>
                </div>
            </div>

            {/* Content Breakdown */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                    <Film className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-xs text-text-muted w-14">Movies</span>
                    <div className="flex-1">
                        <ProgressBar value={movieCount} max={totalMovies} size="sm" />
                    </div>
                    <span className="text-xs text-text-muted w-8 text-right">{movieCount}/{totalMovies}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Tv className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-xs text-text-muted w-14">Series</span>
                    <div className="flex-1">
                        <ProgressBar value={seriesCount} max={totalSeries} size="sm" />
                    </div>
                    <span className="text-xs text-text-muted w-8 text-right">{seriesCount}/{totalSeries}</span>
                </div>
                {totalSpecials > 0 && (
                    <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-xs text-text-muted w-14">Specials</span>
                        <div className="flex-1">
                            <ProgressBar value={specialCount} max={totalSpecials} size="sm" />
                        </div>
                        <span className="text-xs text-text-muted w-8 text-right">{specialCount}/{totalSpecials}</span>
                    </div>
                )}
            </div>

            {/* Saga Progress */}
            <div className="pt-3 border-t border-white/10">
                <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Sagas</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted w-16">Infinity</span>
                        <div className="flex-1">
                            <ProgressBar value={stats.bySaga.infinity} size="sm" />
                        </div>
                        <span className="text-xs w-8 text-right">{stats.bySaga.infinity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted w-16">Multiverse</span>
                        <div className="flex-1">
                            <ProgressBar value={stats.bySaga.multiverse} size="sm" />
                        </div>
                        <span className="text-xs w-8 text-right">{stats.bySaga.multiverse}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
