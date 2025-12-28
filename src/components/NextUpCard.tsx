'use client';

import { useTracker } from '@/context/TrackerContext';
import { formatRuntime } from '@/lib/utils';
import { PlayCircle, CheckCircle2, Clock, Film, Tv, Star } from 'lucide-react';

export default function NextUpCard() {
    const { nextToWatch, toggleStatus, progress, stats } = useTracker();

    if (!nextToWatch) {
        return (
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-success/10 via-transparent to-background" />
                <div className="relative text-center z-10 p-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-success">
                        Journey Complete!
                    </h2>
                    <p className="text-text-secondary text-lg mb-2">
                        You&apos;ve watched all {stats.totalItems} MCU titles!
                    </p>
                    <p className="text-text-muted">
                        Ready for a rewatch?
                    </p>
                </div>
            </div>
        );
    }

    const status = progress[nextToWatch.id] || 'not_started';
    const isWatching = status === 'watching';

    return (
        <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
            {/* Poster Background */}
            {nextToWatch.poster && (
                <div className="absolute inset-0">
                    <img
                        src={nextToWatch.poster}
                        alt=""
                        className="w-full h-full object-cover object-top"
                    />
                    {/* Gradient overlays for readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
                </div>
            )}

            {/* Content */}
            <div className="relative h-full flex items-end z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 w-full">
                    <div className="flex items-end gap-6">
                        {/* Poster Card */}
                        <div className="hidden sm:block flex-shrink-0 w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 transform hover:scale-105 transition-transform duration-300">
                            {nextToWatch.poster ? (
                                <img
                                    src={nextToWatch.poster}
                                    alt={nextToWatch.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-surface flex items-center justify-center">
                                    {nextToWatch.type === 'movie' ? (
                                        <Film className="w-12 h-12 text-text-muted" />
                                    ) : (
                                        <Tv className="w-12 h-12 text-text-muted" />
                                    )}
                                </div>
                            )}
                            {/* Type badge */}
                            <div className="absolute top-2 left-2">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${nextToWatch.type === 'movie'
                                    ? 'bg-primary text-white'
                                    : nextToWatch.type === 'series'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-secondary text-black'
                                    }`}>
                                    {nextToWatch.type}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2 mb-2">
                                {isWatching ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-semibold">
                                        <PlayCircle className="w-4 h-4" />
                                        Continue Watching
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                                        <Star className="w-4 h-4" />
                                        Up Next
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
                                {nextToWatch.title}
                            </h1>

                            {/* Meta Row */}
                            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                                <span
                                    className={`phase-${nextToWatch.phase} px-2.5 py-1 rounded-lg font-semibold`}
                                    style={{
                                        backgroundColor: 'color-mix(in srgb, var(--phase-color) 20%, transparent)',
                                        color: 'var(--phase-color)'
                                    }}
                                >
                                    Phase {nextToWatch.phase}
                                </span>
                                <span className={`px-2.5 py-1 rounded-lg font-medium ${nextToWatch.saga === 'infinity'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                    {nextToWatch.saga === 'infinity' ? 'Infinity Saga' : 'Multiverse Saga'}
                                </span>
                                <span className="flex items-center gap-1.5 text-text-secondary">
                                    <Clock className="w-4 h-4" />
                                    {nextToWatch.runtime
                                        ? formatRuntime(nextToWatch.runtime)
                                        : `${nextToWatch.episodes} episodes`}
                                </span>
                            </div>

                            {/* Description */}
                            {nextToWatch.description && (
                                <p className="text-text-secondary mb-5 line-clamp-2 max-w-2xl">
                                    {nextToWatch.description}
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => toggleStatus(nextToWatch.id)}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105 ${isWatching
                                        ? 'bg-success text-white shadow-lg shadow-success/30'
                                        : 'btn-primary'
                                        }`}
                                >
                                    {isWatching ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Mark Complete</span>
                                        </>
                                    ) : nextToWatch.type === 'series' ? (
                                        <>
                                            <PlayCircle className="w-5 h-5" />
                                            <span>Start Watching</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Mark Watched</span>
                                        </>
                                    )}
                                </button>

                                {/* Progress indicator */}
                                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                    <span className="text-sm text-text-muted">Progress</span>
                                    <span className="text-lg font-bold text-primary">{stats.overall}%</span>
                                    <span className="text-sm text-text-muted">({stats.totalCompleted}/{stats.totalItems})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
