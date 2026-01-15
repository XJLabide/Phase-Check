'use client';

import { useState } from 'react';
import { useTracker } from '@/context/TrackerContext';
import SearchBar from './SearchBar';
import AuthButton from './AuthButton';
import ConfirmModal from './ConfirmModal';
import { RotateCcw, EyeOff, Eye } from 'lucide-react';

export default function Header() {
    const { resetProgress, filters, setFilters } = useTracker();
    const [showResetModal, setShowResetModal] = useState(false);

    const hideCompleted = filters.status?.includes('not_started') || filters.status?.includes('watching');

    const toggleHideCompleted = () => {
        if (hideCompleted) {
            // Show all
            setFilters({ ...filters, status: undefined });
        } else {
            // Hide completed
            setFilters({ ...filters, status: ['not_started', 'watching'] });
        }
    };

    const handleReset = () => {
        setShowResetModal(true);
    };

    const confirmReset = () => {
        resetProgress();
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-[#06090d]/95 backdrop-blur-sm border-b border-[#1c2128]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="w-9 h-9 rounded-lg bg-[#e53935] flex items-center justify-center font-bold text-white text-lg">
                                P
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-white">Phase Check</h1>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-md">
                            <SearchBar />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <AuthButton />

                            {/* Hide Completed Toggle */}
                            <button
                                onClick={toggleHideCompleted}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${hideCompleted
                                    ? 'bg-[#e53935] text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-[#1c2128]'
                                    }`}
                                title={hideCompleted ? 'Show completed' : 'Hide completed'}
                            >
                                {hideCompleted ? (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        <span className="hidden sm:inline">Show All</span>
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="w-4 h-4" />
                                        <span className="hidden sm:inline">Hide Watched</span>
                                    </>
                                )}
                            </button>

                            {/* Reset Button */}
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1c2128] transition-colors text-sm"
                                title="Reset progress"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span className="hidden sm:inline">Reset</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Reset Confirmation Modal */}
            <ConfirmModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                onConfirm={confirmReset}
                title="Reset Progress"
                message="Are you sure you want to reset all your watch progress? This action cannot be undone."
                confirmText="Reset All"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
}

