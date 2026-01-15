// MCU Content Types

export type ContentType = 'movie' | 'series' | 'special';
export type Phase = 1 | 2 | 3 | 4 | 5 | 6;
export type Saga = 'infinity' | 'multiverse';
export type WatchStatus = 'not_started' | 'watching' | 'completed';
export type WatchOrderType = 'release' | 'chronological' | 'custom';

export interface MCUContent {
  id: string;
  title: string;
  type: ContentType;
  phase: Phase;
  saga: Saga;
  releaseOrder: number;
  chronologicalOrder: number;
  releaseDate: string;
  runtime?: number;        // minutes for movies
  episodes?: number;       // for series
  poster?: string;
  description?: string;
  // Enhanced content fields
  tmdbId?: number;           // TMDB movie/tv ID for API calls
  trailerKey?: string;       // YouTube video key
  streamingPlatforms?: string[]; // e.g. ['Disney+']
  isUpcoming?: boolean;      // For unreleased content
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface TMDBDetails {
  rating?: number;
  voteCount?: number;
  cast?: CastMember[];
  crew?: { name: string; job: string }[];
  watchProviders?: { logo: string; name: string }[];
}

export interface UserNote {
  contentId: string;
  note: string;
  userRating?: number;       // User's personal rating (1-5 stars)
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface WatchProgress {
  [contentId: string]: WatchStatus;
}

export interface UserPreferences {
  watchOrder: WatchOrderType;
  customOrder?: string[];  // Array of content IDs in custom order
  lastWatchedId?: string;
}

export interface ProgressStats {
  overall: number;           // 0-100 percentage
  byPhase: Record<Phase, number>;
  bySaga: Record<Saga, number>;
  totalCompleted: number;
  totalItems: number;
  currentStreak: number;
}

export interface WatchTimeStats {
  totalMinutesWatched: number;
  totalMinutesRemaining: number;
  averageMinutesPerDay: number;
  estimatedCompletionDate?: string;
}

export interface FilterOptions {
  phases?: Phase[];
  sagas?: Saga[];
  types?: ContentType[];
  status?: WatchStatus[];
}

