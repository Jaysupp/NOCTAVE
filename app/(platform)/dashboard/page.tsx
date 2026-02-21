"use client"

import { GlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ListTodo, Calendar, Clock, BarChart3, Plus } from "lucide-react";
import { useUI } from "@/components/providers/ui-provider";
import { useUser } from "@/components/providers/user-provider";
import { cn } from "@/lib/utils";
import SpotlightCards from "@/components/ui/spotlight-cards";

export default function Home() {
  const { user, isLoading } = useUser();
  const { isLampOn } = useUI();

  if (isLoading || !user) {
    return <div className="text-zinc-500">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 transition-opacity duration-1000 lamp-off:opacity-80")}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Good Evening, {user.username}</h1>
          <p className="text-zinc-400 mt-1">Ready to conquer the night?</p>
        </div>
      </div>

      {/* Stats Grid */}
      <SpotlightCards
        className="px-0 pt-0 pb-0"
        eyebrow=""
        heading=""
        items={[
          {
            icon: Clock,
            title: "4h 12m",
            description: "Focus Time • +12% from last night",
            color: "#f59e0b",
          },
          {
            icon: ListTodo,
            title: "12/15",
            description: "Tasks Completed • 3 remaining",
            color: "#a78bfa",
          },
          {
            icon: BarChart3,
            title: "88%",
            description: "Efficiency • High productivity zone",
            color: "#34d399",
          },
          {
            icon: Calendar,
            title: "02:30 AM",
            description: "Upcoming Break • In 45 minutes",
            color: "#38bdf8",
          },
        ]}
      />

      {/* Main Content Area */}
      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-7 transition-opacity duration-1000 lamp-off:opacity-80")}>

        {/* Today's Schedule */}
        <GlassCard className="col-span-4 bg-zinc-950 border border-white/10 hover:bg-zinc-900" variant="default">
          <CardHeader>
            <CardTitle className="text-white">Tonight's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "10:00 PM", task: "Review Algorithms", status: "Completed", color: "text-zinc-500 line-through" },
                { time: "11:30 PM", task: "Project Architecture", status: "In Progress", color: "text-white" },
                { time: "01:00 AM", task: "Database Design", status: "Pending", color: "text-zinc-300" },
                { time: "03:00 AM", task: "System Integration", status: "Pending", color: "text-zinc-400" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-zinc-500">{item.time}</span>
                    <span className={`font-medium ${item.color}`}>{item.task}</span>
                  </div>
                  <div className="text-xs text-zinc-600">{item.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>

        {/* Quick Review */}
        <GlassCard className="col-span-3 bg-zinc-950 border border-white/10 hover:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">Quick Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-900">
                <h4 className="font-semibold text-zinc-200 mb-2">Algorithm Notes</h4>
                <p className="text-sm text-zinc-400">Review specific graph traversal methods before the mock interview.</p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-900">
                <h4 className="font-semibold text-zinc-200 mb-2">Design System</h4>
                <p className="text-sm text-zinc-400">Check contrast ratios for the new dark mode palette.</p>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
