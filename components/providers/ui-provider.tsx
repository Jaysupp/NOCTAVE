"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface UIContextType {
    isLampOn: boolean
    toggleLamp: () => void
    setLamp: (isOn: boolean) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
    // Default to true (Lamp On / Slate Background) based on user description implying transition *back* to original.
    // "When isLampOn is true: Transition back to the original" -> implies starting state might be true?
    // Or if "Night Sky" is the special mode (False), then default should probably be True (Standard Mode).
    // Default to false (Lamp Off / Noctave Mode) so the Black Hole background is visible by default.
    const [isLampOn, setIsLampOn] = useState(false)

    useEffect(() => {
        // Run once on mount to set initial class
        if (isLampOn) {
            document.documentElement.classList.add('lamp-on')
            document.documentElement.classList.remove('lamp-off')
        } else {
            document.documentElement.classList.add('lamp-off')
            document.documentElement.classList.remove('lamp-on')
        }
    }, [])

    const toggleLamp = () => {
        setIsLampOn((prev) => {
            const next = !prev;
            if (next) {
                document.documentElement.classList.add('lamp-on')
                document.documentElement.classList.remove('lamp-off')
            } else {
                document.documentElement.classList.add('lamp-off')
                document.documentElement.classList.remove('lamp-on')
            }
            return next;
        })
    }

    const setLamp = (isOn: boolean) => {
        setIsLampOn(isOn)
        if (isOn) {
            document.documentElement.classList.add('lamp-on')
            document.documentElement.classList.remove('lamp-off')
        } else {
            document.documentElement.classList.add('lamp-off')
            document.documentElement.classList.remove('lamp-on')
        }
    }

    return (
        <UIContext.Provider value={{ isLampOn, toggleLamp, setLamp }}>
            {children}
        </UIContext.Provider>
    )
}

export function useUI() {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider")
    }
    return context
}
