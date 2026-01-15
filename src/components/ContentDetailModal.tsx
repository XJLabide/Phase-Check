'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play, Star, Clock, Calendar, Users, Tv, ExternalLink } from 'lucide-react';
import { MCUContent, TMDBDetails, WatchStatus } from '@/lib/types';
import { useTMDB, fetchTrailer } from '@/hooks/useTMDB';
import { getTMDBInfo } from '@/data/tmdb-ids';
import { useTracker } from '@/context/TrackerContext';

interface ContentDetailModalProps {
    content: MCUContent | null;
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'overview' | 'trailer' | 'cast' | 'watch';

export default function ContentDetailModal({ content, isOpen, onClose }: ContentDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [tmdbDetails, setTmdbDetails] = useState<TMDBDetails | null>(null);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const { fetchDetails, getImageUrl, loading } = useTMDB();
    const { progress, setStatus } = useTracker();

    // Fetch TMDB data when modal opens
    useEffect(() => {
        if (isOpen && content) {
            const tmdbInfo = getTMDBInfo(content.id);
            if (tmdbInfo) {
                fetchDetails(tmdbInfo.id, tmdbInfo.type).then(setTmdbDetails);
                fetchTrailer(tmdbInfo.id, tmdbInfo.type).then(setTrailerKey);
            }
            setActiveTab('overview');
        }
    }, [isOpen, content, fetchDetails]);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !content) return null;

    const status = progress[content.id] || 'not_started';

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handleStatusChange = (newStatus: WatchStatus) => {
        setStatus(content.id, newStatus);
    };

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Overview', icon: <Clock className="w-4 h-4" /> },
        { id: 'trailer', label: 'Trailer', icon: <Play className="w-4 h-4" /> },
        { id: 'cast', label: 'Cast', icon: <Users className="w-4 h-4" /> },
        { id: 'watch', label: 'Where to Watch', icon: <Tv className="w-4 h-4" /> },
    ];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="relative w-full sm:max-w-4xl h-[90vh] sm:h-auto sm:max-h-[90vh] bg-[#0d1117] border-t sm:border border-[#1c2128] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col"
            >
                {/* Header with backdrop image */}
                <div className="relative h-48 sm:h-64 flex-shrink-0 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${content.poster})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 to-transparent" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Title overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{content.title}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(content.releaseDate).getFullYear()}
                            </span>
                            {content.runtime && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {Math.floor(content.runtime / 60)}h {content.runtime % 60}m
                                </span>
                            )}
                            {content.episodes && (
                                <span>{content.episodes} episodes</span>
                            )}
                            {tmdbDetails?.rating && (
                                <span className="flex items-center gap-1 text-yellow-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    {tmdbDetails.rating.toFixed(1)}
                                </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-[#e53935] text-white text-xs font-medium">
                                Phase {content.phase}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#1c2128] overflow-x-auto scrollbar-hide flex-shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
                                ? 'text-white border-b-2 border-[#e53935] bg-[#1c2128]/50'
                                : 'text-gray-400 hover:text-white hover:bg-[#1c2128]/30'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Description */}
                            <p className="text-gray-300 leading-relaxed">{content.description}</p>

                            {/* Watch Status */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Watch Status</h3>
                                <div className="flex gap-2">
                                    {(['not_started', 'watching', 'completed'] as WatchStatus[]).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusChange(s)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${status === s
                                                ? s === 'completed'
                                                    ? 'bg-green-600 text-white'
                                                    : s === 'watching'
                                                        ? 'bg-yellow-600 text-white'
                                                        : 'bg-gray-600 text-white'
                                                : 'bg-[#1c2128] text-gray-400 hover:bg-[#2d333b]'
                                                }`}
                                        >
                                            {s === 'not_started' ? 'Not Started' : s === 'watching' ? 'Watching' : 'Completed'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Crew */}
                            {tmdbDetails?.crew && tmdbDetails.crew.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-2">Crew</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tmdbDetails.crew.map((person, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-[#1c2128] text-sm text-gray-300">
                                                {person.name} <span className="text-gray-500">({person.job})</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'trailer' && (
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            {trailerKey ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0`}
                                    title={`${content.title} Trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    {loading ? 'Loading trailer...' : 'No trailer available'}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'cast' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {loading && <p className="text-gray-400 col-span-full">Loading cast...</p>}
                            {tmdbDetails?.cast?.map((member) => (
                                <div key={member.id} className="text-center">
                                    <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#1c2128] mb-2">
                                        {member.profilePath ? (
                                            <img
                                                src={getImageUrl(member.profilePath, 'w185')}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <Users className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-white truncate">{member.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{member.character}</p>
                                </div>
                            ))}
                            {!loading && (!tmdbDetails?.cast || tmdbDetails.cast.length === 0) && (
                                <p className="text-gray-400 col-span-full">No cast information available</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'watch' && (
                        <div>
                            <h3 className="text-lg font-medium text-white mb-4">Streaming Platforms</h3>
                            {loading && <p className="text-gray-400">Loading...</p>}
                            {tmdbDetails?.watchProviders && tmdbDetails.watchProviders.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {tmdbDetails.watchProviders.map((provider, i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1c2128]">
                                            <img
                                                src={provider.logo}
                                                alt={provider.name}
                                                className="w-10 h-10 rounded-lg"
                                            />
                                            <span className="text-white font-medium">{provider.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : !loading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 mb-4">No streaming information available for your region.</p>
                                    <a
                                        href={`https://www.google.com/search?q=watch+${encodeURIComponent(content.title)}+streaming`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e53935] text-white hover:bg-[#c62828] transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Search Online
                                    </a>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
