"use client"

import { GlassCard, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/glass-card"
import { CheckSquare } from "lucide-react"

export default function TasksPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Tasks</h1>
            <GlassCard>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-zinc-400" />
                        <CardTitle className="text-white">Your Tasks</CardTitle>
                    </div>
                    <CardDescription className="text-zinc-500">Manage your daily objectives.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                        Task management coming soon...
                    </div>
                </CardContent>
            </GlassCard>
        </div>
    )
}
