'use client';

import { MCUContent, WatchStatus } from '@/lib/types';
import { useTracker } from '@/context/TrackerContext';
import { useToast } from '@/context/ToastContext';
import { formatRuntime } from '@/lib/utils';
import { CheckCircle2, Circle, PlayCircle, Film, Tv, Star, Clock } from 'lucide-react';

interface ContentCardProps {
    content: MCUContent;
}

export default function ContentCard({ content }: ContentCardProps) {
    const { progress, toggleStatus } = useTracker();
    const { showToast } = useToast();
    const status: WatchStatus = progress[content.id] || 'not_started';

    const getTypeIcon = () => {
        switch (content.type) {
            case 'movie':
                return <Film className="w-3.5 h-3.5" />;
            case 'series':
                return <Tv className="w-3.5 h-3.5" />;
            default:
                return <Star className="w-3.5 h-3.5" />;
        }
    };

    const handleClick = () => {
        const previousStatus = status;
        toggleStatus(content.id);

        // Determine what the new status will be
        let newStatus: WatchStatus;
        if (previousStatus === 'not_started') {
            newStatus = content.type === 'series' ? 'watching' : 'completed';
        } else if (previousStatus === 'watching') {
            newStatus = 'completed';
        } else {
            newStatus = 'not_started';
        }

        // Show appropriate toast with undo
        const messages: Record<WatchStatus, string> = {
            completed: `Marked "${content.title}" as watched`,
            watching: `Started watching "${content.title}"`,
            not_started: `Unmarked "${content.title}"`,
        };

        showToast(messages[newStatus], 'success', () => {
            // Undo action - toggle back
            toggleStatus(content.id);
        });
    };

    return (
        <div
            className={`bg-[#0d1117] rounded-lg cursor-pointer group relative overflow-hidden transition-all duration-200 border border-[#30363d] hover:border-[#e53935]/50 ${status === 'completed' ? 'opacity-50' : ''
                }`}
            onClick={handleClick}
        >
            <div className="flex gap-3 p-3">
                {/* Poster */}
                <div className="flex-shrink-0 relative">
                    <div className={`w-12 h-18 rounded overflow-hidden ${status === 'completed' ? 'grayscale' : ''
                        }`}>
                        {content.poster ? (
                            <img
                                src={content.poster}
                                alt={content.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#30363d] flex items-center justify-center text-gray-500">
                                {getTypeIcon()}
                            </div>
                        )}
                    </div>

                    {/* Status indicator */}
                    <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0d1117] transition-colors ${status === 'completed' ? 'bg-[#22c55e]' :
                                status === 'watching' ? 'bg-amber-500' :
                                    'bg-[#30363d] group-hover:bg-[#e53935]'
                            }`}
                    >
                        {status === 'completed' ? (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                        ) : status === 'watching' ? (
                            <PlayCircle className="w-3 h-3 text-white" />
                        ) : (
                            <Circle className="w-3 h-3 text-gray-500 group-hover:text-white" />
                        )}
                    </div>
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0 py-0.5">
                    <h3 className={`font-medium text-sm leading-tight mb-1 ${status === 'completed' ? 'text-gray-500 line-through' : 'text-white'
                        }`}>
                        {content.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                            {getTypeIcon()}
                            <span className="capitalize">{content.type}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {content.runtime ? formatRuntime(content.runtime) : `${content.episodes} eps`}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0 self-center">
                    {status === 'completed' && (
                        <span className="text-[10px] text-[#22c55e] font-medium">Watched</span>
                    )}
                    {status === 'watching' && (
                        <span className="text-[10px] text-amber-400 font-medium">Watching</span>
                    )}
                </div>
            </div>
        </div>
    );
}
