'use client';

import { Clock, Calendar, TrendingUp, Target } from 'lucide-react';
import { WatchTimeStats } from '@/lib/types';

interface StatsCardProps {
    stats: WatchTimeStats;
}

export default function WatchTimeStatsCard({ stats }: StatsCardProps) {
    const hoursWatched = Math.floor(stats.totalMinutesWatched / 60);
    const hoursRemaining = Math.floor(stats.totalMinutesRemaining / 60);
    const totalHours = hoursWatched + hoursRemaining;
    const percentComplete = totalHours > 0 ? Math.round((hoursWatched / totalHours) * 100) : 0;

    return (
        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#1c2128]">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#e53935]" />
                Watch Time
            </h3>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="h-2 bg-[#1c2128] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#e53935] to-[#ff6f60] rounded-full transition-all duration-500"
                        style={{ width: `${percentComplete}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{hoursWatched}h watched</span>
                    <span>{hoursRemaining}h remaining</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1c2128]/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <Target className="w-3 h-3" />
                        Total Runtime
                    </div>
                    <p className="text-lg font-bold text-white">{totalHours}h</p>
                </div>

                <div className="bg-[#1c2128]/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <TrendingUp className="w-3 h-3" />
                        Progress
                    </div>
                    <p className="text-lg font-bold text-[#e53935]">{percentComplete}%</p>
                </div>

                {stats.estimatedCompletionDate && (
                    <div className="col-span-2 bg-[#1c2128]/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                            <Calendar className="w-3 h-3" />
                            Est. Completion
                        </div>
                        <p className="text-sm font-medium text-white">
                            {new Date(stats.estimatedCompletionDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
