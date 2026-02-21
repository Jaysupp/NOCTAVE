"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Text_01Props {
    text: string;
    className?: string;
}

export function ShimmerText({
    text = "Text Shimmer",
    className,
}: Text_01Props) {
    return (
        <div className="flex items-center justify-center pointer-events-none">
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                <motion.span
                    animate={{
                        backgroundPosition: ["200% center", "-200% center"],
                    }}
                    className={cn(
                        "inline-block bg-[length:200%_100%] bg-gradient-to-r from-zinc-400 via-white to-zinc-400 bg-clip-text text-transparent",
                        className
                    )}
                    transition={{
                        duration: 8, // Made significantly slower as requested (was 2.5)
                        ease: "linear",
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                >
                    {text}
                </motion.span>
            </motion.div>
        </div>
    );
}
