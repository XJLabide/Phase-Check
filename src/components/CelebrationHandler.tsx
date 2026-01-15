'use client';

import { useEffect, useRef, useState } from 'react';
import { useTracker } from '@/context/TrackerContext';
import { useToast } from '@/context/ToastContext';
import { Phase } from '@/lib/types';
import { getPhaseInfo } from '@/lib/utils';
import { Trophy, PartyPopper } from 'lucide-react';

export default function CelebrationHandler() {
    const { stats, allContent, progress } = useTracker();
    const { showToast } = useToast();
    const previousPhaseProgress = useRef<Record<Phase, number>>({} as Record<Phase, number>);
    const [celebratingPhase, setCelebratingPhase] = useState<Phase | null>(null);

    useEffect(() => {
        // Check for phase completions
        const phases: Phase[] = [1, 2, 3, 4, 5, 6];

        for (const phase of phases) {
            const prevProgress = previousPhaseProgress.current[phase] || 0;
            const currentProgress = stats.byPhase[phase];

            // Phase just completed!
            if (prevProgress < 100 && currentProgress === 100) {
                const phaseInfo = getPhaseInfo(phase);
                setCelebratingPhase(phase);

                showToast(
                    `🎉 Phase ${phase} Complete! You finished ${phaseInfo.name}!`,
                    'success'
                );

                // Clear celebration after animation
                setTimeout(() => setCelebratingPhase(null), 3000);
            }
        }

        // Update previous progress
        previousPhaseProgress.current = { ...stats.byPhase };
    }, [stats.byPhase, showToast]);

    // Check for full completion
    useEffect(() => {
        if (stats.overall === 100 && allContent.length > 0) {
            showToast(
                `🏆 LEGENDARY! You've completed the entire MCU!`,
                'success'
            );
        }
    }, [stats.overall, allContent.length, showToast]);

    if (!celebratingPhase) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {/* Celebration overlay */}
            <div className="absolute inset-0 bg-[#22c55e]/10 animate-fade-in" />

            {/* Celebration badge */}
            <div className="relative animate-scale-in">
                <div className="bg-[#0d1117] border-2 border-[#22c55e] rounded-2xl p-8 shadow-2xl shadow-[#22c55e]/20 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                        <Trophy className="w-10 h-10 text-[#22c55e]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Phase {celebratingPhase} Complete!
                    </h3>
                    <p className="text-gray-400">
                        {getPhaseInfo(celebratingPhase).name} finished
                    </p>
                </div>
            </div>
        </div>
    );
}
