'use client';

import { cn } from '@/lib/utils';

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

    const heights = {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
    };

    return (
        <div className="w-full">
            {(showLabel || label) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && (
                        <span className="text-sm text-text-secondary">{label}</span>
                    )}
                    {showLabel && (
                        <span className={cn(
                            'font-semibold',
                            size === 'lg' ? 'text-base' : 'text-sm',
                            isComplete ? 'text-success' : 'text-foreground'
                        )}>
                            {percentage}%
                        </span>
                    )}
                </div>
            )}

            <div className={cn(
                'w-full bg-surface-elevated rounded-full overflow-hidden',
                heights[size]
            )}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        isComplete ? 'bg-success' : 'bg-text-secondary'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
