"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Clock, Zap, Brain, Moon, Sun } from "lucide-react"

interface ScheduleItem {
    start_time: string
    task_id: string
    explanation: string
    energy_level: 'High' | 'Medium' | 'Low'
}

interface TimelineProps {
    schedule: ScheduleItem[]
    isLoading?: boolean
}

export function Timeline({ schedule, isLoading }: TimelineProps) {
    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-16 h-8 bg-zinc-800 rounded" />
                        <div className="flex-1 h-24 bg-zinc-800/50 rounded-xl" />
                    </div>
                ))}
            </div>
        )
    }

    if (!schedule.length) return null

    return (
        <div className="relative space-y-8 p-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
            {schedule.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                    {/* Icon/Dot on the Line */}
                    <div className="absolute left-0 w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 shadow flex items-center justify-center md:left-1/2 md:-translate-x-1/2 z-10 group-hover:scale-110 transition-transform duration-300 group-hover:border-indigo-500/50 group-hover:bg-indigo-950/20">
                        {item.energy_level === 'High' ? (
                            <Zap className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                        ) : item.energy_level === 'Medium' ? (
                            <Brain className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                        ) : (
                            <Moon className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
                        )}
                    </div>

                    {/* Time (Mobile: Right of Icon, Desktop: Opposite Side) */}
                    <div className="pl-14 md:pl-0 md:w-1/2 md:pr-12 md:text-right group-odd:md:pl-12 group-odd:md:text-left flex items-center md:block">
                        <span className="hidden md:block text-2xl font-bold text-zinc-500 group-hover:text-zinc-200 transition-colors tabular-nums tracking-tight">
                            {item.start_time}
                        </span>
                    </div>

                    {/* Content Card */}
                    <div className="w-[calc(100%-3.5rem)] md:w-1/2 pl-14 md:pl-12 group-odd:md:pr-12 group-odd:md:pl-0 group-odd:md:text-right">
                        <div className="flex md:hidden items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-zinc-400 tabular-nums">
                                {item.start_time}
                            </span>
                        </div>
                        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all hover:bg-zinc-900/60 shadow-lg backdrop-blur-sm group-hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                            <h3 className="text-lg font-bold text-zinc-100 mb-1 group-odd:md:ml-auto group-even:md:mr-auto w-fit bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                {item.task_id}
                            </h3>
                            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                {item.explanation}
                            </p>

                            <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 group-odd:md:justify-end">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full border",
                                    item.energy_level === 'High' ? "border-amber-500/20 text-amber-500 bg-amber-500/10" :
                                        item.energy_level === 'Medium' ? "border-indigo-500/20 text-indigo-500 bg-indigo-500/10" :
                                            "border-purple-500/20 text-purple-500 bg-purple-500/10"
                                )}>
                                    {item.energy_level} Energy
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
