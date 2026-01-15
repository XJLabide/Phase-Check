'use client';

import { cn } from '@/lib/utils';
import { useId } from 'react';

interface ProgressBarProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    label?: string;
}

export default function ProgressBar({
    value,
    max = 100,
    size = 'md',
    showLabel = false,
    label,
}: ProgressBarProps) {
    const percentage = Math.min(Math.round((value / max) * 100), 100);
    const isComplete = percentage === 100;
    const clipId = useId();

    // Shield sizes based on prop
    const shieldSizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
    };

    // Calculate the Y position for the clip (100 = empty, 0 = full)
    // We use the viewBox coordinates (0-36)
    const clipY = 36 - (36 * percentage / 100);

    return (
        <div className="flex items-center gap-2">
            {label && (
                <span className="text-sm text-text-secondary">{label}</span>
            )}

            {/* Captain America Shield - Bucket Fill */}
            <div className={cn('relative', shieldSizes[size])}>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <defs>
                        {/* Clip path that reveals from bottom based on percentage */}
                        <clipPath id={clipId}>
                            <rect
                                x="0"
                                y={clipY}
                                width="36"
                                height={36 - clipY}
                                className="transition-all duration-700 ease-out"
                            />
                        </clipPath>
                    </defs>

                    {/* Gray base shield (always visible) */}
                    <g className="shield-gray">
                        {/* Outer ring */}
                        <circle cx="18" cy="18" r="17" fill="#374151" stroke="#4b5563" strokeWidth="0.5" />
                        {/* Second ring */}
                        <circle cx="18" cy="18" r="13" fill="#4b5563" stroke="#6b7280" strokeWidth="0.5" />
                        {/* Third ring */}
                        <circle cx="18" cy="18" r="9" fill="#6b7280" stroke="#9ca3af" strokeWidth="0.5" />
                        {/* Center circle */}
                        <circle cx="18" cy="18" r="5" fill="#9ca3af" />
                        {/* Star (gray) */}
                        <polygon
                            points="18,14 19.2,16.5 22,16.8 20,18.7 20.5,21.5 18,20 15.5,21.5 16,18.7 14,16.8 16.8,16.5"
                            fill="#d1d5db"
                        />
                    </g>

                    {/* Colored shield (clipped to show based on progress) */}
                    <g clipPath={`url(#${clipId})`}>
                        {/* Outer ring - Red */}
                        <circle cx="18" cy="18" r="17" fill={isComplete ? '#22c55e' : '#e53935'} />
                        {/* Second ring - White */}
                        <circle cx="18" cy="18" r="13" fill={isComplete ? '#86efac' : '#ffffff'} />
                        {/* Third ring - Blue */}
                        <circle cx="18" cy="18" r="9" fill={isComplete ? '#22c55e' : '#3b82f6'} />
                        {/* Center circle - Blue */}
                        <circle cx="18" cy="18" r="5" fill={isComplete ? '#16a34a' : '#1d4ed8'} />
                        {/* Star - White */}
                        <polygon
                            points="18,14 19.2,16.5 22,16.8 20,18.7 20.5,21.5 18,20 15.5,21.5 16,18.7 14,16.8 16.8,16.5"
                            fill="#ffffff"
                        />
                    </g>
                </svg>
            </div>

            {showLabel && (
                <span className={cn(
                    'font-semibold',
                    size === 'lg' ? 'text-base' : 'text-sm',
                    isComplete ? 'text-[#22c55e]' : 'text-white'
                )}>
                    {percentage}%
                </span>
            )}
        </div>
    );
}
