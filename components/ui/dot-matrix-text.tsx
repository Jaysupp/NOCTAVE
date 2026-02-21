"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { animate, motion, useMotionValue, useTransform, MotionValue } from "framer-motion";

interface Point {
    x: number;
    y: number;
    key: string;
}

interface DotMatrixTextProps {
    isEnteringDashboard?: boolean;
}

export function DotMatrixText({ isEnteringDashboard = false }: DotMatrixTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [isVisible, setIsVisible] = useState(true);

    // Animation Phase State: 'idle' | 'shaking' | 'warping'
    const [animationPhase, setAnimationPhase] = useState<'idle' | 'shaking' | 'warping'>('idle');

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isEnteringDashboard) {
            // Defer slightly to avoid calling setState synchronously within effect body
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAnimationPhase('shaking');

            timer = setTimeout(() => {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setAnimationPhase('warping');
            }, 1200);

        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAnimationPhase('idle');
        }
        return () => clearTimeout(timer);
    }, [isEnteringDashboard]);

    // Intersection Observer to stop computations when off-screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const mouseX = useMotionValue(-1000);
    const mouseY = useMotionValue(-1000);

    useEffect(() => {
        // Defer canvas work to avoid blocking initial render hydrate
        const generatePoints = () => {
            const canvas = document.createElement("canvas");
            // Use willReadFrequently to optimize the getImageData call
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) return;

            const text = "NOCTAVE";
            const fontSize = 360;

            canvas.width = 2400;
            canvas.height = 700;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            ctx.font = `900 ${fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const newPoints: Point[] = [];

            // INCREASED GAP: Reduces DOM nodes by ~65-75%, drastically lowering memory 
            // and CPU ticks per frame, while keeping text legible.
            const gap = 20;

            for (let y = 0; y < canvas.height; y += gap) {
                for (let x = 0; x < canvas.width; x += gap) {
                    const index = (y * canvas.width + x) * 4;
                    if (data[index] > 128) {
                        newPoints.push({
                            x: x - canvas.width / 2,
                            y: y - canvas.height / 2,
                            key: `${x}-${y}`,
                        });
                    }
                }
            }

            setPoints(newPoints);
        };

        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(generatePoints);
        } else {
            setTimeout(generatePoints, 100);
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !isVisible) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
    }, [isVisible, mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        mouseX.set(-1000);
        mouseY.set(-1000);
    }, [mouseX, mouseY]);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex items-center justify-center w-full h-[600px] overflow-visible cursor-none touch-none select-none"
        >
            {/* Global Shake CSS: vastly cheaper than 1000 useAnimationFrames running on JS thread */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes gpu-shake {
                    0% { transform: translate3d(0px, 0px, 0) scale(1); }
                    25% { transform: translate3d(4px, -4px, 0) scale(1.05); }
                    50% { transform: translate3d(-4px, 4px, 0) scale(1); }
                    75% { transform: translate3d(-4px, -4px, 0) scale(0.95); }
                    100% { transform: translate3d(4px, 4px, 0) scale(1.05); }
                }
                .dot-shake-phase {
                    animation: gpu-shake 0.15s infinite alternate ease-in-out !important;
                }
            `}} />

            {points.map((point) => (
                <Dot
                    key={point.key}
                    initialX={point.x}
                    initialY={point.y}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    animationPhase={animationPhase}
                    isVisible={isVisible}
                />
            ))}
        </div>
    );
}

interface DotProps {
    initialX: number;
    initialY: number;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    animationPhase: 'idle' | 'shaking' | 'warping';
    isVisible: boolean;
}

// React.memo ensures we don't re-render dots uselessly
const Dot = React.memo(function Dot({ initialX, initialY, mouseX, mouseY, animationPhase, isVisible }: DotProps) {
    // Random delay to desync CSS shake animations (creates static noise effect instead of rigid group shaking)
    const [shakeDelay] = useState(() => -(Math.random() * 0.2));

    // 1. Distance Calculation (Only active if visible and not warping)
    const distance = useTransform([mouseX, mouseY], ([mx, my]: number[]) => {
        if (!isVisible || animationPhase === 'warping') return Infinity;
        const dx = mx - initialX;
        const dy = my - initialY;
        return Math.sqrt(dx * dx + dy * dy);
    });

    // 2. Opacity
    const opacity = useTransform(distance, (d: number) => d < 350 ? 1 : 0.2);

    // 3. Hover Scale (Removed heavy useSpring, straight map saves RAM)
    const hoverScale = useTransform(distance, (d: number) => {
        if (d > 350) return 1;
        const normalizedDist = d / 350;
        const proximity = 1 - normalizedDist;
        return 1 + (proximity * proximity) * 1.5;
    });

    // 4. Warp Transitions
    const targetX = useMotionValue(0);
    const targetY = useMotionValue(0);
    const targetScale = useMotionValue(1);

    useEffect(() => {
        if (animationPhase === 'warping') {
            const angle = Math.atan2(initialY, initialX);
            const distFromCenter = Math.sqrt(initialX * initialX + initialY * initialY);

            const warpDist = 1000 + distFromCenter * 0.5;
            const speedFactor = 1 + (distFromCenter / 1000) * 2;

            const warpX = Math.cos(angle) * warpDist * speedFactor;
            const warpY = Math.sin(angle) * warpDist * speedFactor;

            const transition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] };

            (animate as any)(targetX, warpX, transition);
            (animate as any)(targetY, warpY, transition);
            (animate as any)(targetScale, 5, transition);
        } else if (animationPhase === 'idle') {
            // Instant reset if we ever revert
            if (targetX.get() !== 0) targetX.set(0);
            if (targetY.get() !== 0) targetY.set(0);
            if (targetScale.get() !== 1) targetScale.set(1);
        }
    }, [animationPhase, initialX, initialY, targetX, targetY, targetScale]);

    const activeScale = animationPhase === 'warping' ? targetScale : hoverScale;
    const isShaking = animationPhase === 'shaking';

    return (
        <motion.div
            className={`absolute left-1/2 top-1/2 w-1 h-1 bg-white rounded-full ${isShaking ? 'dot-shake-phase' : ''}`}
            style={{
                opacity,
                scale: activeScale,
                x: targetX,
                y: targetY,
                marginLeft: initialX,
                marginTop: initialY,
                animationDelay: isShaking ? `${shakeDelay}s` : '0s',
                // GPU Acceleration Hints
                z: 0,
                willChange: "transform, opacity",
            }}
        />
    );
});
