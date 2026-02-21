"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Moon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
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
import { LayoutDashboard, Calendar, CheckSquare, BarChart2, Settings, LogOut } from "lucide-react"
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

export function MobileNav() {
    const [open, setOpen] = React.useState(false) // State to control sheet open/close
    const pathname = usePathname()
    const router = require("next/navigation").useRouter()
    const { user, logout } = useUser()

    if (!user) return null

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent hover:text-white md:hidden"
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-black border-r-zinc-900 text-zinc-400">
                <SheetHeader className="px-1 border-b border-zinc-900 pb-4 mb-4">
                    <SheetTitle className="flex items-center gap-2 font-bold text-zinc-100">
                        <Moon className="h-6 w-6 text-zinc-100" />
                        <span className="font-heading font-black tracking-tight uppercase">Noctave</span>
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-1">
                    <div className="flex flex-col space-y-3">
                        {sidebarNavItems.map(
                            (item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        onMouseEnter={() => router.prefetch(item.href)}
                                        className={cn(
                                            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-zinc-100 transition-[color,background-color]",
                                            pathname === item.href ? "bg-zinc-900 text-zinc-100" : "transparent"
                                        )}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {item.title}
                                    </Link>
                                )
                            }
                        )}
                        <div className="mt-auto border-t border-zinc-900 pt-4">
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
                                        onClick={() => setOpen(false)}
                                        onMouseEnter={() => router.prefetch("/settings")}
                                    >
                                        <DropdownMenuItem className="focus:bg-zinc-900 focus:text-zinc-200 cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator className="bg-zinc-800" />
                                    <DropdownMenuItem onClick={() => { setOpen(false); logout(); }} className="text-red-500 focus:text-red-400 focus:bg-red-950/20 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
