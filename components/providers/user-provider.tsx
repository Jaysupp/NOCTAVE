"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface User {
    id: string
    username: string
    email: string
    avatar: string
    last_username_change: string | null
}

interface UserContextType {
    user: User | null
    isLoading: boolean
    updateUser: (updates: Partial<User>) => Promise<void>
    logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser()

                if (!authUser) {
                    setUser(null)
                    setIsLoading(false)
                    return
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single()

                if (profile) {
                    setUser({
                        id: authUser.id,
                        email: authUser.email || '',
                        username: profile.username || authUser.email?.split('@')[0] || 'User',
                        avatar: profile.avatar_url || "https://github.com/shadcn.png",
                        last_username_change: profile.last_username_change
                    })
                } else {
                    // Fallback if profile doesn't exist yet (should trigger creation in real app, but for safety handle here)
                    setUser({
                        id: authUser.id,
                        email: authUser.email || '',
                        username: authUser.email?.split('@')[0] || 'User',
                        avatar: "https://github.com/shadcn.png",
                        last_username_change: null
                    })
                }
            } catch (error) {
                console.error('Error fetching user:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                setIsLoading(true)
                fetchUser()
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                router.push('/')
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase, router])

    const updateUser = async (updates: Partial<User>) => {
        if (!user) return

        try {
            // Check for username change restriction
            if (updates.username && updates.username !== user.username) {
                if (user.last_username_change) {
                    const lastChange = new Date(user.last_username_change)
                    const now = new Date()
                    const diffTime = Math.abs(now.getTime() - lastChange.getTime())
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    const daysRemaining = 15 - diffDays;

                    // STRICT BLOCK: logical check before API call
                    if (diffDays < 15) {
                        const message = `You can only change your username once every 15 days. Days remaining: ${daysRemaining}`;
                        toast.error(message);
                        return; // Stop execution entirely
                    }
                }

                // Update timestamp if username sends
                // Use upsert to handle cases where profile might not exist yet
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        username: updates.username,
                        last_username_change: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select()

                if (error) {
                    console.error('Supabase update error:', error)

                    // Specific check for policy violation
                    if (error.code === '42501' || error.message.includes('policy')) {
                        toast.error('Permission denied. Please try logging in again.')
                        throw new Error('Permission denied')
                    }

                    throw new Error(error.message || 'Failed to update username')
                }

                // Update local state immediately for better UX
                // This ensures the bottom-left profile card updates instantly
                setUser(prev => prev ? ({
                    ...prev,
                    username: updates.username!,
                    last_username_change: new Date().toISOString()
                }) : null)

                toast.success("Username updated successfully")
            }

            // Handle other updates...

        } catch (error: any) {
            // Only log if it's not the permission denied error we already handled
            if (error.message !== 'Permission denied') {
                console.error('Error updating user verbose:', { message: error.message, details: error.details, hint: error.hint, code: error.code, full: error })
            }
            // Rethrow so the component can handle it if needed
            throw error
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
    }

    return (
        <UserContext.Provider value={{ user, isLoading, updateUser, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
