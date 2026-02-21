"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
    className?: string;
    intensity?: "subtle" | "medium" | "strong";
    isDarkMode?: boolean;
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
    const angle = -35 + Math.random() * 10;
    // We only use the deep dark mode hues since this only appears in Dark Mode
    const hueBase = 190;
    const hueRange = 70;

    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 30 + Math.random() * 60,
        length: height * 2.5,
        angle,
        speed: 0.6 + Math.random() * 1.2,
        opacity: 0.12 + Math.random() * 0.16,
        hue: hueBase + Math.random() * hueRange,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
    };
}

export function BeamsBackground({
    className,
    intensity = "strong",
    isDarkMode = false,
}: AnimatedGradientBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beamsRef = useRef<Beam[]>([]);
    const animationFrameRef = useRef<number>(0);
    const isDarkModeRef = useRef(isDarkMode);
    const transitionMultiplierRef = useRef(isDarkMode ? 1 : 0);
    const isAnimatingRef = useRef(false);
    const animateRef = useRef<() => void>(() => { });

    const MINIMUM_BEAMS = 20;

    const opacityMap = {
        subtle: 0.7,
        medium: 0.85,
        strong: 1,
    };

    // Keep ref synced
    useEffect(() => {
        isDarkModeRef.current = isDarkMode;
        // Kickstart the animation loop if we are transitioning into Dark Mode and it was stopped
        if (isDarkMode && !isAnimatingRef.current) {
            isAnimatingRef.current = true;
            animateRef.current();
        }
    }, [isDarkMode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            const totalBeams = MINIMUM_BEAMS * 1.5;
            beamsRef.current = Array.from({ length: totalBeams }, () =>
                createBeam(canvas.width, canvas.height)
            );
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        function resetBeam(beam: Beam, index: number, totalBeams: number) {
            if (!canvas) return beam;

            const column = index % 3;
            const spacing = canvas.width / 3;

            beam.y = canvas.height + 100;
            beam.x =
                column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
            beam.width = 100 + Math.random() * 100;
            beam.speed = 0.5 + Math.random() * 0.4;
            beam.hue = 190 + (index * 70) / totalBeams;
            beam.opacity = 0.2 + Math.random() * 0.1;
            return beam;
        }

        function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam, multiplier: number) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            // Fade opacity with the multiplier
            const pulsingOpacity =
                beam.opacity *
                (0.8 + Math.sin(beam.pulse) * 0.2) *
                opacityMap[intensity] * multiplier;

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

            const saturation = "85%";
            const lightness = "65%";

            gradient.addColorStop(0, `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`);
            gradient.addColorStop(0.1, `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity * 0.5})`);
            gradient.addColorStop(0.4, `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity})`);
            gradient.addColorStop(0.6, `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity})`);
            gradient.addColorStop(0.9, `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        function animate() {
            if (!(canvas && ctx)) return;

            // 1-second linear transition logic (assuming 60fps, 1/60 ~ 0.016)
            const target = isDarkModeRef.current ? 1 : 0;
            const step = 0.016;

            if (transitionMultiplierRef.current < target) {
                transitionMultiplierRef.current = Math.min(1, transitionMultiplierRef.current + step);
            } else if (transitionMultiplierRef.current > target) {
                transitionMultiplierRef.current = Math.max(0, transitionMultiplierRef.current - step);
            }

            const currentMultiplier = transitionMultiplierRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Removed expensive ctx.filter = "blur(35px)"; using static CSS instead

            const totalBeams = beamsRef.current.length;
            beamsRef.current.forEach((beam, index) => {
                // Apply multiplier to slow down beams naturally to a halt
                beam.y -= beam.speed * currentMultiplier;
                beam.pulse += beam.pulseSpeed * currentMultiplier;

                // Reset beam when it goes off screen
                if (beam.y + beam.length < -100) {
                    resetBeam(beam, index, totalBeams);
                }

                drawBeam(ctx, beam, currentMultiplier);
            });

            // KILL THE LOOP: Zero-Motion Void reached OR document is hidden (Rule 10)
            if ((currentMultiplier === 0 && !isDarkModeRef.current) || document.visibilityState === "hidden") {
                isAnimatingRef.current = false;
                return;
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        animateRef.current = animate;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && !isAnimatingRef.current && (transitionMultiplierRef.current > 0 || isDarkModeRef.current)) {
                isAnimatingRef.current = true;
                animate();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        if (transitionMultiplierRef.current > 0 || isDarkModeRef.current) {
            isAnimatingRef.current = true;
            animate();
        }

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [intensity]); // isDarkMode removed from dependencies to preserve loop!

    return (
        <div
            className={cn(
                "relative min-h-screen w-full overflow-hidden transition-colors duration-1000",
                isDarkMode ? "bg-neutral-950" : "bg-black",
                className
            )}
        >
            <canvas
                className="absolute inset-0"
                ref={canvasRef}
                style={{ filter: "blur(15px)" }}
            />

            <motion.div
                animate={{
                    opacity: [0.05, 0.15, 0.05],
                }}
                className={cn(
                    "absolute inset-0 transition-colors duration-1000",
                    isDarkMode ? "bg-neutral-950/5" : "bg-black"
                )}
                // Removed extremely expensive backdropFilter: blur(50px)
                transition={{
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            />
        </div>
    );
}
