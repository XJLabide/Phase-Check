'use client';

import { useTracker } from '@/context/TrackerContext';
import SearchBar from './SearchBar';
import { RotateCcw, EyeOff, Eye } from 'lucide-react';

export default function Header() {
    const { resetProgress, filters, setFilters } = useTracker();

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
        if (confirm('Reset all progress? This cannot be undone.')) {
            resetProgress();
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur-sm border-b border-[#30363d]">
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
                        {/* Hide Completed Toggle */}
                        <button
                            onClick={toggleHideCompleted}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${hideCompleted
                                ? 'bg-[#e53935] text-white'
                                : 'text-gray-400 hover:text-white hover:bg-[#30363d]'
                                }`}
                            title={hideCompleted ? 'Show completed' : 'Hide completed'}
                        >
                            {hideCompleted ? (
                                <>
                                    <EyeOff className="w-4 h-4" />
                                    <span className="hidden sm:inline">Hidden</span>
                                </>
                            ) : (
                                <>
                                    <Eye className="w-4 h-4" />
                                    <span className="hidden sm:inline">All</span>
                                </>
                            )}
                        </button>

                        {/* Reset Button */}
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#30363d] transition-colors text-sm"
                            title="Reset progress"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
