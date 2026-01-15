import { useState, useCallback } from 'react';
import { TMDBDetails, CastMember } from '@/lib/types';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

interface UseTMDBResult {
    loading: boolean;
    error: string | null;
    fetchDetails: (tmdbId: number, type: 'movie' | 'tv') => Promise<TMDBDetails | null>;
    getImageUrl: (path: string | null, size?: string) => string;
}

export function useTMDB(): UseTMDBResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getImageUrl = useCallback((path: string | null, size: string = 'w500'): string => {
        if (!path) return '/placeholder-poster.png';
        return `${TMDB_IMAGE_BASE}/${size}${path}`;
    }, []);

    const fetchDetails = useCallback(async (
        tmdbId: number,
        type: 'movie' | 'tv'
    ): Promise<TMDBDetails | null> => {
        if (!TMDB_API_KEY) {
            setError('TMDB API key not configured');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch main details + credits + watch providers in parallel
            const [detailsRes, creditsRes, providersRes] = await Promise.all([
                fetch(`${TMDB_BASE_URL}/${type}/${tmdbId}?api_key=${TMDB_API_KEY}`),
                fetch(`${TMDB_BASE_URL}/${type}/${tmdbId}/credits?api_key=${TMDB_API_KEY}`),
                fetch(`${TMDB_BASE_URL}/${type}/${tmdbId}/watch/providers?api_key=${TMDB_API_KEY}`)
            ]);

            if (!detailsRes.ok) {
                throw new Error('Failed to fetch details');
            }

            const details = await detailsRes.json();
            const credits = creditsRes.ok ? await creditsRes.json() : null;
            const providers = providersRes.ok ? await providersRes.json() : null;

            // Extract cast (top 10)
            const cast: CastMember[] = credits?.cast?.slice(0, 10).map((member: {
                id: number;
                name: string;
                character: string;
                profile_path?: string;
            }) => ({
                id: member.id,
                name: member.name,
                character: member.character,
                profilePath: member.profile_path
            })) || [];

            // Extract key crew (director, writers)
            const crew = credits?.crew?.filter((member: { job: string }) =>
                ['Director', 'Writer', 'Screenplay', 'Creator'].includes(member.job)
            ).slice(0, 5).map((member: { name: string; job: string }) => ({
                name: member.name,
                job: member.job
            })) || [];

            // Extract US watch providers (flatrate = streaming)
            const usProviders = providers?.results?.US?.flatrate || [];
            const watchProviders = usProviders.map((p: { logo_path: string; provider_name: string }) => ({
                logo: getImageUrl(p.logo_path, 'w92'),
                name: p.provider_name
            }));

            return {
                rating: details.vote_average,
                voteCount: details.vote_count,
                cast,
                crew,
                watchProviders
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    }, [getImageUrl]);

    return {
        loading,
        error,
        fetchDetails,
        getImageUrl
    };
}

// Fetch trailer from TMDB videos endpoint
export async function fetchTrailer(tmdbId: number, type: 'movie' | 'tv'): Promise<string | null> {
    if (!TMDB_API_KEY) return null;

    try {
        const res = await fetch(
            `${TMDB_BASE_URL}/${type}/${tmdbId}/videos?api_key=${TMDB_API_KEY}`
        );

        if (!res.ok) return null;

        const data = await res.json();

        // Find official trailer or first YouTube video
        const trailer = data.results?.find(
            (v: { type: string; site: string }) =>
                v.type === 'Trailer' && v.site === 'YouTube'
        ) || data.results?.find(
            (v: { site: string }) => v.site === 'YouTube'
        );

        return trailer?.key || null;
    } catch {
        return null;
    }
}
