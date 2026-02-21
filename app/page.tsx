"use client";

import React, { useState } from "react";
import { LoginDialog } from "@/components/auth/login-dialog";
import { SignUpDialog } from "@/components/auth/signup-dialog";
import { DotMatrixText } from "@/components/ui/dot-matrix-text";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [isEnteringDashboard, setIsEnteringDashboard] = useState(false);
  const router = useRouter();

  const handleDashboardClick = () => {
    setIsEnteringDashboard(true);
    // "Make the Warp animation more longer like 5 seconds."
    setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-black">

      {/* Animated Fade Out Wrapper for Main Content */}
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center flex-grow"
        // Fade out slowly throughout the 5s transition?
        // Or keep it visible for the "explosion" which starts at 1.2s?
        // If we fade out to 0, the dots disappear. We want the dots to be visible during the warp!
        // The dots themselves handle opacity? No, `DotMatrixText` renders dots.
        // If we fade parent to 0, dots vanish.
        // Let's fade out the *background* (which is already black).
        // Actually, the previous implementation faded everything out.
        // "Fade Out: The entire landing page should fade to an opacity of 0"
        // But if we fade to 0 too early, we miss the warp.
        // Let's fade out slowly starting after the explosion?
        // Explosion starts at 1.2s. Lasts for... indefinite?
        // Let's fade out from 2s to 5s.
        animate={{ opacity: isEnteringDashboard ? 0 : 1 }}
        transition={{ duration: 3, delay: 2, ease: "easeIn" }}
      >
        <main className="relative z-10 flex flex-col items-center justify-start pt-32 w-full h-full flex-grow">
          {/* Pass the transition state to trigger warp */}
          <DotMatrixText isEnteringDashboard={isEnteringDashboard} />
        </main>
      </motion.div>

      {/* Footer / Bottom Section: Fixed at bottom 20% */}
      {/* "slowly transition out the subtitle and the login and sign up button towards the bottom and out of the webpage." */}
      <motion.div
        className="absolute bottom-[20%] left-0 right-0 flex flex-col items-center space-y-8 z-20 pointer-events-none"
        animate={isEnteringDashboard ? { y: 200, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >

        {/* Subtitle */}
        <p className="text-zinc-500 text-xs md:text-sm tracking-[0.4em] font-medium uppercase drop-shadow-md">
          AI Study Planner for Night Owls
        </p>

        {/* Buttons - Enable pointer events for them */}
        <div className="flex flex-row items-center justify-center gap-4 pointer-events-auto">
          {/* Pass the handler to LoginDialog */}
          <LoginDialog onDashboardClick={handleDashboardClick} />
          <SignUpDialog />
        </div>
      </motion.div>

      <motion.footer
        className="absolute bottom-8 text-zinc-800 text-xs z-10"
        animate={isEnteringDashboard ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1 }}
      >
        &copy; 2026 <span className="font-heading font-black tracking-tight uppercase">Noctave</span>
      </motion.footer>
    </div>
  );
}
