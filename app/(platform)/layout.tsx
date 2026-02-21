"use client";

import { PullChain } from "@/components/ui/pull-chain";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useUI } from "@/components/providers/ui-provider";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/user-provider";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BeamsBackground } from "@/components/ui/beams-background";
import Dither from "@/components/ui/dither";

export default function PlatformLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isLampOn } = useUI();
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-16 w-16 text-zinc-500 animate-spin" />
            </div>
        )
    }

    if (!user) return null;

    return (
        <div className="relative min-h-screen">
            <PullChain />
            {/* Background Layer */}
            <div className="fixed inset-0 z-0 bg-black">
                <AnimatePresence>
                    {!isLampOn ? (
                        <motion.div
                            key="light-bg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <BeamsBackground isDarkMode={false} className="h-full w-full" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dark-bg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <Dither
                                waveColor={[0.5, 0.5, 0.5]}
                                disableAnimation={false}
                                enableMouseInteraction
                                mouseRadius={0.3}
                                colorNum={4}
                                waveAmplitude={0.3}
                                waveFrequency={3}
                                waveSpeed={0.05}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Content Wrapper */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", damping: 20 }}
                    className={cn(
                        "relative z-10 flex min-h-screen transition-all duration-1000",
                        "lamp-off:bg-black/20" // Replaced JS conditional and removed heavy backdrop filter
                    )}
                >
                    {/* Desktop Sidebar */}
                    <div className={cn("transition-opacity duration-1000")}>
                        <Sidebar />
                    </div>

                    {/* Main Content Wrapper */}
                    <main className={cn(
                        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out lamp-off:text-zinc-400"
                    )}>
                        {/* Mobile Header */}
                        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-zinc-800 bg-black/80 px-4 md:hidden">
                            <MobileNav />
                            <span className="text-lg font-heading font-black tracking-tight uppercase">Noctave</span>
                        </header>

                        {/* Main Content */}
                        <div className={cn(
                            "flex-1 p-4 md:p-8 pt-6 transition-all duration-500"
                            // Removed extra blur on content area for performance
                        )}>
                            {children}
                        </div>
                    </main>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
