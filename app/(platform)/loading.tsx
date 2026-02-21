import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-[300px]" />
                    <Skeleton className="h-5 w-[200px]" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col justify-between min-h-[160px] p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-[120px]" />
                            <Skeleton className="h-4 w-[140px]" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Today's Schedule Skeleton */}
                <div className="col-span-4 rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
                    <Skeleton className="h-6 w-[200px] mb-6" />
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-transparent">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Review Skeleton */}
                <div className="col-span-3 rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
                    <Skeleton className="h-6 w-[150px] mb-6" />
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full rounded-lg" />
                        <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    )
}
