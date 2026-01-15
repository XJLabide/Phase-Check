// TMDB ID mappings for MCU content
// Source: themoviedb.org

export const tmdbIdMap: Record<string, { id: number; type: 'movie' | 'tv' }> = {
    // Phase 1
    'iron-man': { id: 1726, type: 'movie' },
    'the-incredible-hulk': { id: 1724, type: 'movie' },
    'iron-man-2': { id: 10138, type: 'movie' },
    'thor': { id: 10195, type: 'movie' },
    'captain-america-first-avenger': { id: 1771, type: 'movie' },
    'marvels-the-avengers': { id: 24428, type: 'movie' },

    // Phase 2
    'iron-man-3': { id: 68721, type: 'movie' },
    'thor-dark-world': { id: 76338, type: 'movie' },
    'captain-america-winter-soldier': { id: 100402, type: 'movie' },
    'guardians-of-the-galaxy': { id: 118340, type: 'movie' },
    'avengers-age-of-ultron': { id: 99861, type: 'movie' },
    'ant-man': { id: 102899, type: 'movie' },

    // Phase 3
    'captain-america-civil-war': { id: 271110, type: 'movie' },
    'doctor-strange': { id: 284052, type: 'movie' },
    'guardians-of-the-galaxy-vol-2': { id: 283995, type: 'movie' },
    'spider-man-homecoming': { id: 315635, type: 'movie' },
    'thor-ragnarok': { id: 284053, type: 'movie' },
    'black-panther': { id: 284054, type: 'movie' },
    'avengers-infinity-war': { id: 299536, type: 'movie' },
    'ant-man-and-the-wasp': { id: 363088, type: 'movie' },
    'captain-marvel': { id: 299537, type: 'movie' },
    'avengers-endgame': { id: 299534, type: 'movie' },
    'spider-man-far-from-home': { id: 429617, type: 'movie' },

    // Phase 4 - Movies
    'black-widow': { id: 497698, type: 'movie' },
    'shang-chi': { id: 566525, type: 'movie' },
    'eternals': { id: 524434, type: 'movie' },
    'spider-man-no-way-home': { id: 634649, type: 'movie' },
    'doctor-strange-multiverse': { id: 453395, type: 'movie' },
    'thor-love-and-thunder': { id: 616037, type: 'movie' },
    'black-panther-wakanda-forever': { id: 505642, type: 'movie' },

    // Phase 4 - Series
    'wandavision': { id: 85271, type: 'tv' },
    'falcon-winter-soldier': { id: 88396, type: 'tv' },
    'loki': { id: 84958, type: 'tv' },
    'what-if': { id: 91363, type: 'tv' },
    'hawkeye': { id: 88329, type: 'tv' },
    'moon-knight': { id: 92749, type: 'tv' },
    'ms-marvel': { id: 92782, type: 'tv' },
    'i-am-groot': { id: 114469, type: 'tv' },
    'she-hulk': { id: 92783, type: 'tv' },

    // Phase 4 - Specials
    'werewolf-by-night': { id: 894205, type: 'movie' },
    'guardians-holiday-special': { id: 774752, type: 'movie' },

    // Phase 5 - Movies
    'ant-man-quantumania': { id: 640146, type: 'movie' },
    'guardians-vol-3': { id: 447365, type: 'movie' },
    'the-marvels': { id: 609681, type: 'movie' },
    'deadpool-wolverine': { id: 533535, type: 'movie' },

    // Phase 5 - Series
    'secret-invasion': { id: 114472, type: 'tv' },
    'loki-season-2': { id: 84958, type: 'tv' },
    'what-if-season-2': { id: 91363, type: 'tv' },
    'echo': { id: 122226, type: 'tv' },
    'agatha-all-along': { id: 138501, type: 'tv' },
    'what-if-season-3': { id: 91363, type: 'tv' },
};

// Helper to get TMDB info for a content ID
export function getTMDBInfo(contentId: string): { id: number; type: 'movie' | 'tv' } | null {
    return tmdbIdMap[contentId] || null;
}
