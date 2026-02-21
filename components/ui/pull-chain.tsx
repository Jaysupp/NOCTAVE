"use client"

import React, { useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { useUI } from "@/components/providers/ui-provider"

interface PullChainProps {
    onToggle?: (isOn: boolean) => void
}

export function PullChain({ onToggle }: PullChainProps) {
    const { isLampOn, toggleLamp } = useUI()

    // Motion values for the handle position
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Spring physics - Low damping for loose, natural pendulum feel
    const springConfig = { stiffness: 300, damping: 10, mass: 1 }
    const springX = useSpring(x, springConfig)
    const springY = useSpring(y, springConfig)

    // String logic
    const x2 = useTransform(springX, (v) => v + 150)
    const y2 = useTransform(springY, (v) => v + 60)

    const playSound = (turningOn: boolean) => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                if (turningOn) {
                    // "Power down / whoosh" into the void (turning ON the lamp means turning OFF the beams/dark mode)
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(300, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.0); // 1 second fade

                    gain.gain.setValueAtTime(0.5, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);

                    osc.start();
                    osc.stop(ctx.currentTime + 1.0);
                } else {
                    // "Power up" restoring beams (turning OFF the lamp)
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(40, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.8);

                    gain.gain.setValueAtTime(0.01, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.2); // swell
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

                    osc.start();
                    osc.stop(ctx.currentTime + 0.8);
                }
            }
        } catch (e) {
            // ignore
        }
    }

    const handleDragEnd = (_: any, info: any) => {
        const dragY = info.offset.y
        if (dragY > 40) { // Threshold
            const newLampState = !isLampOn;
            toggleLamp()
            playSound(newLampState)
            if (onToggle) onToggle(newLampState)
        }
    }

    return (
        <div className="fixed top-0 right-10 z-[100] w-[300px] h-[400px] pointer-events-none flex justify-center -mr-[135px]">
            <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
                {/* String */}
                <motion.line
                    x1="150" // Start at horizontal center
                    y1="0"   // Start at top
                    x2={x2}
                    y2={y2}
                    stroke="#71717a" // zinc-500
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="opacity-80"
                />
            </svg>

            {/* Handle */}
            <motion.div
                className="absolute top-[60px] cursor-grab active:cursor-grabbing pointer-events-auto touch-none"
                style={{ x: springX, y: springY }}
                drag
                dragConstraints={{ top: 0, left: -100, right: 100, bottom: 200 }}
                dragElastic={0.2}
                dragSnapToOrigin={true}
                onDragEnd={handleDragEnd}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className={`
                    relative flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300
                    ${isLampOn
                        ? "bg-amber-100 border-2 border-amber-300 shadow-amber-500/50"
                        : "bg-zinc-800 border-2 border-zinc-600 shadow-black/50"}
                `}>
                    {/* Inner detail for the "bead" look */}
                    <div className={`w-2 h-2 rounded-full opacity-50 ${isLampOn ? 'bg-amber-500' : 'bg-zinc-500'}`} />

                    {/* Glow when on */}
                    {isLampOn && (
                        <div className="absolute inset-0 rounded-full bg-amber-400 opacity-40 blur-md animate-pulse" />
                    )}
                </div>
            </motion.div>
        </div>
    )
}
