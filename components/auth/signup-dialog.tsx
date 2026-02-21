"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

// Schema
// ... (rest is unmodified)

const signUpSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters.")
        .max(15, "Username must be at most 15 characters.")
        .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type SignUpValues = z.infer<typeof signUpSchema>

export function SignUpDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
    })

    const onSubmit = async (data: SignUpValues) => {
        setIsLoading(true)
        setError(null)

        try {
            // 1. Check if username is already taken
            const { data: existingUser } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', data.username)
                .single()

            if (existingUser) {
                // Set field-specific error
                setError("This username is already claimed by another night owl.")
                setIsLoading(false)
                return
            }

            // 2. Attempt Sign Up
            const { error: signUpError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        username: data.username,
                    },
                },
            })

            if (signUpError) {
                // Check for unique constraint violation in the error message if it comes from trigger
                if (signUpError.message.includes("unique constraint") || signUpError.message.includes("violates unique constraint")) {
                    throw new Error("This username is already claimed by another night owl.")
                }
                throw signUpError
            }

            setSuccess(true)
            // reset() // Optional: keep form filled or reset.
        } catch (err: any) {
            setError(err.message || "Failed to sign up. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            reset()
            setError(null)
            setSuccess(false)
        }
    }

    if (success) {
        return (
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button className="border-white/20 bg-white/10 text-white hover:bg-white/20 px-8 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        SIGN UP
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl bg-black border-zinc-800 text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col items-center justify-center p-8 space-y-6">
                        <div className="h-16 w-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                            <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                        <DialogTitle className="text-3xl font-bold text-center tracking-tight text-white">Account Created</DialogTitle>
                        <DialogDescription className="text-center text-zinc-400 text-lg max-w-sm">
                            Please check your email to verify your account before logging in.
                        </DialogDescription>
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-white text-black hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] h-12 text-base font-medium mt-4"
                        >
                            Got it
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="border-white/20 bg-white/10 text-white hover:bg-white/20 px-8 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    SIGN UP
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-black border-zinc-800 text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8">
                <DialogHeader className="flex flex-col items-center justify-center space-y-0 mb-4 pb-2">
                    <DialogTitle className="text-[3.5rem] leading-[0.8] font-black font-heading tracking-tight uppercase drop-shadow-2xl text-zinc-200 m-0 p-0">
                        NOCTAVE
                    </DialogTitle>
                    <DialogDescription className="text-center font-heading font-bold text-zinc-500/70 text-xs tracking-[0.15em] uppercase mt-2">
                        Create an account
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
                    {error && (
                        <div className="bg-red-950/20 border border-red-900/50 text-red-400 text-sm p-4 rounded-md flex items-center gap-3">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label htmlFor="username" className="text-zinc-400 font-heading font-bold text-xs uppercase tracking-widest">Username</Label>
                        <Input
                            id="username"
                            placeholder="Enter a Username"
                            className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:ring-zinc-700 h-14 text-base font-medium transition-all duration-300 hover:border-zinc-700 px-4"
                            {...register("username")}
                        />
                        {errors.username && <p className="text-red-400 text-sm">{errors.username.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-zinc-400 font-heading font-bold text-xs uppercase tracking-widest">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter an Email"
                            className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:ring-zinc-700 h-14 text-base font-medium transition-all duration-300 hover:border-zinc-700 px-4"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="password" className="text-zinc-400 font-heading font-bold text-xs uppercase tracking-widest">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:ring-zinc-700 h-14 text-base font-medium transition-all duration-300 hover:border-zinc-700 px-4 pr-12"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <Eye className="h-5 w-5" />
                                ) : (
                                    <EyeOff className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="confirmPassword" className="text-zinc-400 font-heading font-bold text-xs uppercase tracking-widest">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:ring-zinc-700 h-14 text-base font-medium transition-all duration-300 hover:border-zinc-700 px-4 pr-12"
                                {...register("confirmPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <Eye className="h-5 w-5" />
                                ) : (
                                    <EyeOff className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] mt-6 h-14 text-lg font-black font-heading tracking-tight uppercase"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog >
    )
}
