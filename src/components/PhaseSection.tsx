'use client';

import { useState } from 'react';
import { Phase, MCUContent } from '@/lib/types';
import { useTracker } from '@/context/TrackerContext';
import { getPhaseInfo, sortByOrder } from '@/lib/utils';
import ContentCard from './ContentCard';
import ConfirmModal from './ConfirmModal';
import { ChevronDown, CheckCheck } from 'lucide-react';

interface PhaseSectionProps {
    phase: Phase;
    onOpenDetail?: (content: MCUContent) => void;
}

export default function PhaseSection({ phase, onOpenDetail }: PhaseSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const { contentByPhase, progress, stats, watchOrder, filters, markPhaseComplete } = useTracker();

    const phaseInfo = getPhaseInfo(phase);

    // Filter content by type and status
    const filteredContent = sortByOrder(contentByPhase[phase], watchOrder).filter(item => {
        // Apply type filter (Movies, Series, Specials)
        if (filters.types && filters.types.length > 0) {
            if (!filters.types.includes(item.type)) return false;
        }
        // Apply status filter (Watched, Watching, Not started)
        if (filters.status && filters.status.length > 0) {
            const itemStatus = progress[item.id] || 'not_started';
            if (!filters.status.includes(itemStatus)) return false;
        }
        return true;
    });

    const phaseProgress = stats.byPhase[phase];
    const completedCount = filteredContent.filter(item => progress[item.id] === 'completed').length;
    const totalCount = filteredContent.length;
    const isPhaseComplete = phaseProgress === 100;

    // Check if this phase is filtered out
    if (filters.phases && filters.phases.length > 0 && !filters.phases.includes(phase)) {
        return null;
    }

    // Hide phase if no content after filtering
    if (filteredContent.length === 0) {
        return null;
    }

    const handleBulkComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowBulkModal(true);
    };

    const confirmBulkComplete = () => {
        markPhaseComplete(phase);
    };

    return (
        <>
            <div className="bg-[#0d1117] rounded-xl overflow-hidden border border-[#1c2128]">
                {/* Header */}
                <div
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-4">
                        {/* Phase Number */}
                        <div className="w-10 h-10 rounded-lg bg-[#e53935] flex items-center justify-center font-bold text-white text-lg">
                            {phase}
                        </div>

                        <div className="text-left">
                            <h3 className="font-semibold text-white text-base">
                                {phaseInfo.name}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {phaseInfo.saga === 'infinity' ? 'The Infinity Saga' : 'The Multiverse Saga'} · {completedCount}/{totalCount} completed
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mark All Button */}
                        {!isPhaseComplete && (
                            <button
                                onClick={handleBulkComplete}
                                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1c2128] text-xs text-gray-400 hover:text-white hover:bg-[#2d333b] transition-colors"
                                title="Mark all as watched"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark All
                            </button>
                        )}

                        {/* Progress Bar */}
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="w-24 h-1.5 bg-[#1c2128] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isPhaseComplete ? 'bg-green-500' : 'bg-[#e53935]'}`}
                                    style={{ width: `${phaseProgress}%` }}
                                />
                            </div>
                            <span className={`text-xs w-8 ${isPhaseComplete ? 'text-green-500' : 'text-[#e53935]'}`}>
                                {phaseProgress}%
                            </span>
                        </div>

                        {/* Expand/Collapse */}
                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[5000px]' : 'max-h-0'
                    }`}>
                    <div className="p-4 pt-0">
                        <div className="grid gap-2">
                            {filteredContent.map((content) => (
                                <ContentCard key={content.id} content={content} onOpenDetail={onOpenDetail} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Complete Confirmation Modal */}
            <ConfirmModal
                isOpen={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                onConfirm={confirmBulkComplete}
                title={`Mark ${phaseInfo.name} Complete`}
                message={`Mark all ${totalCount} titles in ${phaseInfo.name} as watched?`}
                confirmText="Mark All Watched"
                cancelText="Cancel"
                variant="warning"
            />
        </>
    );
}

