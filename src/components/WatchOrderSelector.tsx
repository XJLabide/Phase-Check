'use client';

import { useTracker } from '@/context/TrackerContext';
import { WatchOrderType } from '@/lib/types';
import { Calendar, Clock, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WatchOrderSelector() {
    const { watchOrder, setWatchOrder } = useTracker();

    const orders: { type: WatchOrderType; label: string; icon: React.ReactNode }[] = [
        { type: 'release', label: 'Release', icon: <Calendar className="w-4 h-4" /> },
        { type: 'chronological', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
        { type: 'custom', label: 'Custom', icon: <Shuffle className="w-4 h-4" /> },
    ];

    return (
        <div className="glass-card p-3 sm:p-4 h-full">
            <h3 className="text-[10px] sm:text-xs font-medium text-text-muted mb-2 sm:mb-3 uppercase tracking-wider">
                Watch Order
            </h3>

            <div className="flex gap-1.5 sm:gap-2">
                {orders.map((order) => {
                    const isActive = watchOrder === order.type;
                    const isDisabled = order.type === 'custom';

                    return (
                        <button
                            key={order.type}
                            onClick={() => !isDisabled && setWatchOrder(order.type)}
                            disabled={isDisabled}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200',
                                isActive && 'bg-foreground text-background',
                                !isActive && !isDisabled && 'bg-surface text-text-secondary hover:bg-surface-elevated hover:text-foreground',
                                isDisabled && 'bg-surface/30 text-text-muted/40 cursor-not-allowed'
                            )}
                        >
                            {order.icon}
                            <span className="hidden sm:inline">{order.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
