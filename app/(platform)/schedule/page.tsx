"use client"

import { useState } from "react"
import { useUI } from "@/components/providers/ui-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Timeline } from "@/components/schedule/timeline"
import { Sparkles, Loader2, Moon, Clock } from "lucide-react"
import { toast } from "sonner"

export default function SchedulePage() {
    const { isLampOn } = useUI()
    const [isLoading, setIsLoading] = useState(false)
    const [schedule, setSchedule] = useState([])
    const [sleepTime, setSleepTime] = useState("02:00 AM")
    const [tasks, setTasks] = useState("Study Linear Algebra\nComplete React Project\nRead 20 pages of sci-fi novel\nReview Flashcards")

    const handleGenerate = async () => {
        setIsLoading(true)
        setSchedule([]) // Clear previous schedule

        try {
            // Input Sanitization
            const taskList = tasks.split('\n')
                .map(t => t.trim())
                .filter(t => t.length > 0)

            if (taskList.length === 0) {
                toast.error("Please enter at least one task")
                setIsLoading(false)
                return
            }

            const response = await fetch('/api/generate-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tasks: taskList,
                    sleepTime
                })
            })

            if (!response.ok) {
                // Check if it's likely an API key issue (500 internal server error often means missing key in this context)
                if (response.status === 500) {
                    toast.error('The night sky is cloudy. Please check your Gemini API Key.')
                } else {
                    toast.error('Failed to generate schedule')
                }
                throw new Error('Failed to generate schedule')
            }

            const data = await response.json()
            setSchedule(data.schedule || [])

            if (data.chronotype_tip) {
                toast.success(data.chronotype_tip, {
                    duration: 5000,
                    icon: <Moon className="h-4 w-4 text-indigo-400" />
                })
            }
        } catch (error) {
            console.error(error)
            // Toast is already handled above for specific cases, but generic catch:
            // toast.error("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-white transition-colors duration-500">
                    AI Schedule Generator
                </h1>
                <p className="text-lg text-zinc-500 max-w-2xl">
                    Let our chronobiology engine optimize your night. Input your tasks and sleep time,
                    and we'll build the perfect rhythm for your peak energy windows.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Input Panel */}
                <div className="lg:col-span-1 p-6 rounded-3xl transition-all duration-300 sticky top-24 backdrop-blur-xl bg-black/80 ring-1 ring-white/10 shadow-2xl">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="sleepTime" className="text-zinc-400 font-medium uppercase tracking-wider text-xs">Target Sleep Time</Label>
                            <div className="relative">
                                <Moon className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                                <Input
                                    id="sleepTime"
                                    value={sleepTime}
                                    onChange={(e) => setSleepTime(e.target.value)}
                                    className="pl-10 h-12 bg-black/20 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="tasks" className="text-zinc-400 font-medium uppercase tracking-wider text-xs">Pending Tasks (One per line)</Label>
                            <Textarea
                                id="tasks"
                                value={tasks}
                                onChange={(e: any) => setTasks(e.target.value)}
                                className="min-h-[200px] bg-black/20 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 transition-all resize-none p-4 leading-relaxed font-medium"
                                placeholder="Enter your tasks here..."
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full h-14 text-base font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all duration-300 rounded-xl"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Optimizing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Generate Schedule
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Timeline Visualization */}
                <div className="lg:col-span-2">
                    {schedule.length > 0 || isLoading ? (
                        <Timeline schedule={schedule} isLoading={isLoading} />
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/30">
                            <Clock className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-sm font-medium uppercase tracking-widest opacity-80">Your optimized timeline will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
