'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signOut, User } from 'firebase/auth';
import { LogOut, User as UserIcon, Loader2, LogIn } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // handleSignIn removed as we now link to /login page

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            showToast('Signed out successfully', 'success');
        } catch (error) {
            console.error('Error signing out:', error);
            showToast('Failed to sign out', 'success');
        }
    };

    if (loading) {
        return (
            <div className="w-9 h-9 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
        );
    }

    if (user) {
        return (
            <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-white">{user.displayName}</p>
                    <p className="text-xs text-gray-400">Syncing to Cloud</p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="group relative w-9 h-9 rounded-full overflow-hidden border border-[#1c2128] hover:border-[#e53935] transition-colors"
                    title="Sign Out"
                >
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#1c2128] flex items-center justify-center text-gray-400">
                            <UserIcon className="w-5 h-5" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-[#e53935]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <LogOut className="w-4 h-4 text-white" />
                    </div>
                </button>
            </div>
        );
    }

    return (
        <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#e53935] hover:bg-[#c62828] text-white text-sm font-medium transition-colors"
        >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
        </Link>
    );
}
