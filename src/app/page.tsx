'use client';

import { Phase, WatchStatus } from '@/lib/types';
import { useTracker } from '@/context/TrackerContext';
import { useToast } from '@/context/ToastContext';
import Header from '@/components/Header';
import PhaseSection from '@/components/PhaseSection';
import ContentCard from '@/components/ContentCard';
import CelebrationHandler from '@/components/CelebrationHandler';
import { PlayCircle, CheckCircle2, Clock, Film, Tv, Star, Calendar, Trophy, Target } from 'lucide-react';
import { formatRuntime } from '@/lib/utils';

export default function Home() {
  const phases: Phase[] = [1, 2, 3, 4, 5, 6];
  const {
    stats,
    nextToWatch,
    progress,
    toggleStatus,
    allContent,
    watchOrder,
    setWatchOrder,
    filters,
    setFilters
  } = useTracker();

  const { showToast } = useToast();
  const watchingCount = allContent.filter(c => progress[c.id] === 'watching').length;
  const status = nextToWatch ? (progress[nextToWatch.id] || 'not_started') : 'not_started';

  // Handler for Next Up button with toast
  const handleNextUpClick = () => {
    if (!nextToWatch) return;
    const previousStatus = status;
    toggleStatus(nextToWatch.id);

    let newStatus: WatchStatus;
    if (previousStatus === 'not_started') {
      newStatus = nextToWatch.type === 'series' ? 'watching' : 'completed';
    } else if (previousStatus === 'watching') {
      newStatus = 'completed';
    } else {
      newStatus = 'not_started';
    }

    const messages: Record<WatchStatus, string> = {
      completed: `Marked "${nextToWatch.title}" as watched`,
      watching: `Started watching "${nextToWatch.title}"`,
      not_started: `Unmarked "${nextToWatch.title}"`,
    };

    showToast(messages[newStatus], 'success', () => {
      toggleStatus(nextToWatch.id);
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Header />
      <CelebrationHandler />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Hero Section - Progress + Next Up */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Left - Circular Progress (Captain America Shield Style) */}
          <div className="bg-[#161b22] rounded-xl p-6 flex flex-col items-center justify-center border border-[#30363d]">
            <div className="relative w-36 h-36 mb-4">
              {/* Shield background rings */}
              <svg className="w-full h-full" viewBox="0 0 36 36">
                {/* Outer red ring (background) */}
                <circle cx="18" cy="18" r="17" fill="none" stroke="#30363d" strokeWidth="2" />
                {/* Middle white ring */}
                <circle cx="18" cy="18" r="13" fill="none" stroke="#30363d" strokeWidth="2" />
                {/* Inner blue ring */}
                <circle cx="18" cy="18" r="9" fill="none" stroke="#30363d" strokeWidth="2" />
                {/* Blue center */}
                <circle cx="18" cy="18" r="5" fill="#30363d" />
              </svg>

              {/* Progress overlay */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Red progress (outer) */}
                <circle
                  cx="18" cy="18" r="17"
                  fill="none"
                  stroke="#e53935"
                  strokeWidth="2"
                  strokeDasharray={`${stats.overall} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                {/* White progress (middle) */}
                <circle
                  cx="18" cy="18" r="13"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray={`${stats.overall} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                  style={{ transitionDelay: '100ms' }}
                />
                {/* Blue progress (inner) */}
                <circle
                  cx="18" cy="18" r="9"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray={`${stats.overall} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                  style={{ transitionDelay: '200ms' }}
                />
                {/* Blue center fill */}
                <circle cx="18" cy="18" r="5" fill={stats.overall > 0 ? '#3b82f6' : '#30363d'} className="transition-all duration-700" />
              </svg>

              {/* Center star and text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{stats.overall}%</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {stats.totalItems - stats.totalCompleted} titles remaining
            </p>
            {/* Motivational Message */}
            <p className="text-xs text-[#e53935] mt-2 font-medium">
              {stats.overall === 0 && "Start your MCU journey! 🚀"}
              {stats.overall > 0 && stats.overall < 25 && "Great start! Keep going! 💪"}
              {stats.overall >= 25 && stats.overall < 50 && "You're making progress! 🔥"}
              {stats.overall >= 50 && stats.overall < 75 && "Halfway there! Amazing! ⚡"}
              {stats.overall >= 75 && stats.overall < 100 && "Almost complete! 🏆"}
              {stats.overall === 100 && "Legendary! You did it! 🎉"}
            </p>
          </div>

          {/* Right - Next Up Card */}
          <div className="lg:col-span-2 bg-[#161b22] rounded-xl overflow-hidden border border-[#30363d] relative">
            {nextToWatch?.poster && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url(${nextToWatch.poster})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px)',
                }}
              />
            )}
            <div className="relative p-6 flex gap-5">
              {/* Poster */}
              {nextToWatch && (
                <>
                  <div className="flex-shrink-0 w-28 rounded-lg overflow-hidden border-2 border-[#e53935]/50 shadow-lg shadow-[#e53935]/20">
                    {nextToWatch.poster ? (
                      <img
                        src={nextToWatch.poster}
                        alt={nextToWatch.title}
                        className="w-full aspect-[2/3] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-[#30363d] flex items-center justify-center">
                        <Film className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#e53935] text-white">
                        Next Up
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Film className="w-3 h-3" />
                        {nextToWatch.type}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {nextToWatch.title}
                    </h2>

                    <p className="text-sm text-gray-400 mb-4">
                      Phase {nextToWatch.phase} · {new Date(nextToWatch.releaseDate).getFullYear()} · {
                        nextToWatch.runtime
                          ? formatRuntime(nextToWatch.runtime)
                          : `${nextToWatch.episodes} episodes`
                      }
                    </p>

                    <button
                      onClick={handleNextUpClick}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e53935] hover:bg-[#c62828] text-white font-medium transition-colors"
                    >
                      {status === 'watching' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Complete
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          Mark as Watched
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {!nextToWatch && (
                <div className="flex-1 flex items-center justify-center py-8">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-[#22c55e] mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-white mb-1">All Complete!</h2>
                    <p className="text-gray-400">You&apos;ve watched all {stats.totalItems} titles</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Film className="w-5 h-5" />}
            iconBg="bg-[#e53935]/20"
            iconColor="text-[#e53935]"
            label="Watched"
            value={stats.totalCompleted}
            subtext={`of ${stats.totalItems} titles`}
          />
          <StatCard
            icon={<PlayCircle className="w-5 h-5" />}
            iconBg="bg-amber-500/20"
            iconColor="text-amber-400"
            label="Currently Watching"
            value={watchingCount}
          />
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            iconBg="bg-[#e53935]/20"
            iconColor="text-[#e53935]"
            label="Completion"
            value={`${stats.overall}%`}
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
            iconBg="bg-blue-500/20"
            iconColor="text-blue-400"
            label="Remaining"
            value={stats.totalItems - stats.totalCompleted}
            subtext="titles to go"
          />
        </section>

        {/* Filters Row */}
        <section className="bg-[#161b22] rounded-xl p-4 border border-[#30363d] mb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* Watch Order */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Watch Order:</span>
              <button
                onClick={() => setWatchOrder('release')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${watchOrder === 'release'
                  ? 'bg-[#30363d] text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Calendar className="w-4 h-4" />
                Release Order
              </button>
              <button
                onClick={() => setWatchOrder('chronological')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${watchOrder === 'chronological'
                  ? 'bg-[#e53935] text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Clock className="w-4 h-4" />
                Chronological
              </button>
            </div>

            <div className="w-px h-6 bg-[#30363d] hidden sm:block" />

            {/* Phase */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Phase:</span>
              <PhaseFilter
                phases={phases}
                selected={filters.phases}
                onToggle={(phase) => {
                  const current = filters.phases || [];
                  const updated = current.includes(phase)
                    ? current.filter(p => p !== phase)
                    : [...current, phase];
                  setFilters({ ...filters, phases: updated.length > 0 ? updated : undefined });
                }}
              />
            </div>

            <div className="w-px h-6 bg-[#30363d] hidden sm:block" />

            {/* Format */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Format:</span>
              <FormatFilter
                selected={filters.types}
                onToggle={(type) => {
                  const current = filters.types || [];
                  const updated = current.includes(type)
                    ? current.filter(t => t !== type)
                    : [...current, type];
                  setFilters({ ...filters, types: updated.length > 0 ? updated : undefined });
                }}
                onClear={() => setFilters({ ...filters, types: undefined })}
              />
            </div>
          </div>
        </section>

        {/* Content Section - Phases or Flat List based on watch order */}
        {watchOrder === 'release' ? (
          /* Phase Sections for Release Order */
          <section className="space-y-4">
            {phases.map((phase) => (
              <PhaseSection key={phase} phase={phase} />
            ))}
          </section>
        ) : (
          /* Flat Chronological List */
          <section className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
            <div className="p-4 border-b border-[#30363d]">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#e53935]" />
                Chronological Order
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Watch in story timeline order
              </p>
            </div>
            <div className="p-4 grid gap-2">
              {allContent
                .sort((a, b) => a.chronologicalOrder - b.chronologicalOrder)
                .filter(item => {
                  // Apply type filter
                  if (filters.types && filters.types.length > 0) {
                    if (!filters.types.includes(item.type)) return false;
                  }
                  // Apply status filter
                  if (filters.status && filters.status.length > 0) {
                    const itemStatus = progress[item.id] || 'not_started';
                    if (!filters.status.includes(itemStatus)) return false;
                  }
                  return true;
                })
                .map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  subtext
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="bg-[#161b22] rounded-xl p-4 border border-[#30363d]">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

// Phase Filter Component  
function PhaseFilter({
  phases,
  selected,
  onToggle
}: {
  phases: Phase[];
  selected?: Phase[];
  onToggle: (phase: Phase) => void;
}) {
  const isAll = !selected || selected.length === 0;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onToggle(0 as Phase)} // Clear all
        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${isAll ? 'bg-[#30363d] text-white' : 'text-gray-400 hover:text-white'
          }`}
      >
        All
      </button>
      {phases.map((phase) => (
        <button
          key={phase}
          onClick={() => onToggle(phase)}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${selected?.includes(phase)
            ? 'bg-[#30363d] text-white'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          Phase {phase}
        </button>
      ))}
    </div>
  );
}

// Format Filter Component
function FormatFilter({
  selected,
  onToggle,
  onClear
}: {
  selected?: ('movie' | 'series' | 'special')[];
  onToggle: (type: 'movie' | 'series' | 'special') => void;
  onClear: () => void;
}) {
  const isAll = !selected || selected.length === 0;
  const formats: { type: 'movie' | 'series' | 'special'; label: string; icon: React.ReactNode }[] = [
    { type: 'movie', label: 'Movies', icon: <Film className="w-3.5 h-3.5" /> },
    { type: 'series', label: 'Series', icon: <Tv className="w-3.5 h-3.5" /> },
    { type: 'special', label: 'Specials', icon: <Star className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onClear}
        className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isAll ? 'bg-[#30363d] text-white' : 'text-gray-400 hover:text-white'
          }`}
      >
        All
      </button>
      {formats.map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => onToggle(type)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${selected?.includes(type)
            ? 'bg-[#30363d] text-white'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}

