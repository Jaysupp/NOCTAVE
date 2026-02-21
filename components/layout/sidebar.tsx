"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Calendar, CheckSquare, BarChart2, Settings, Moon, LogOut, Shield } from "lucide-react"
import { useUser } from "@/components/providers/user-provider"

const sidebarNavItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Schedule",
        href: "/schedule",
        icon: Calendar,
    },
    {
        title: "Tasks",
        href: "/tasks",
        icon: CheckSquare,
    },
    {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart2,
    },
]

export function Sidebar() {
    const pathname = usePathname()
    // useRouter is needed for programmatic prefetching
    // Note: In Next.js App Router, Link automatically prefetches on viewport by default.
    // However, user requested "starts pre-loading that page data immediately" on hover.
    // router.prefetch(href) can be used for this.
    const router = require("next/navigation").useRouter()
    const { user, logout } = useUser()

    if (!user) return null

    return (
        <div className="hidden border-r border-zinc-900 bg-black/95 text-zinc-400 md:block w-64 sticky top-0 h-screen z-40">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b border-zinc-900 px-6">
                    <Link
                        className="flex items-center gap-2 font-bold text-zinc-100"
                        href="/dashboard"
                        onMouseEnter={() => router.prefetch("/dashboard")}
                    >
                        <Moon className="h-6 w-6 text-zinc-100" />
                        <span className="font-heading font-black tracking-tight uppercase">Noctave</span>
                    </Link>
                </div>
                <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="flex flex-col gap-1 px-2">
                        {sidebarNavItems.map((item, index) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onMouseEnter={() => router.prefetch(item.href)}
                                >
                                    <span
                                        className={cn(
                                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-zinc-100 transition-[color,background-color]",
                                            pathname === item.href ? "bg-zinc-900 text-zinc-100" : "transparent"
                                        )}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        <span>{item.title}</span>
                                    </span>
                                </Link>
                            )
                        })}
                    </nav>
                </ScrollArea>
                <div className="mt-auto p-4 border-t border-zinc-900">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-900 transition-colors group cursor-pointer">
                                <Avatar className="h-9 w-9 border border-zinc-800">
                                    <AvatarImage src={user.avatar} alt="@shadcn" />
                                    <AvatarFallback>NO</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white">{user.username}</span>
                                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400">View Profile</span>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-400" sideOffset={8}>
                            <DropdownMenuLabel className="text-zinc-500 text-xs font-normal uppercase tracking-wider">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <Link
                                href="/settings"
                                onMouseEnter={() => router.prefetch("/settings")}
                            >
                                <DropdownMenuItem className="focus:bg-zinc-900 focus:text-zinc-200 cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem
                                className="text-red-500 focus:text-red-400 focus:bg-red-950/20 cursor-pointer"
                                onClick={logout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}
