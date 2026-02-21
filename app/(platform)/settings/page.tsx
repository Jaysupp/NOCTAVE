"use client"

import { useState, useEffect } from "react";
import { GlassCard, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Bell, Shield, LogOut, Moon, Sun, Brain, Target, Lock, ArrowRight, Check } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/components/providers/ui-provider";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { user, updateUser, isLoading } = useUser();
    const { isLampOn } = useUI();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Password Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordStep, setPasswordStep] = useState(1); // 1: Current, 2: New/Confirm
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Sync state with user context when it loads
    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUser({ username });
            // Email update logic would go here if implemented in provider
        } catch (error) {
            console.error("Failed to update profile", error)
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = () => {
        if (passwordStep === 1) {
            // Validate current password (mock)
            if (currentPassword.length > 0) {
                setPasswordStep(2);
                setPasswordError("");
            } else {
                setPasswordError("Please enter your current password.");
            }
        } else {
            // Validate new password
            if (newPassword !== confirmPassword) {
                setPasswordError("Passwords do not match.");
                return;
            }
            if (newPassword.length < 6) {
                setPasswordError("Password must be at least 6 characters.");
                return;
            }
            // Success
            setIsPasswordModalOpen(false);
            resetPasswordState();
            // In a real app, calls API to update password here
        }
    };

    const resetPasswordState = () => {
        setPasswordStep(1);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
    };

    // Helper to get card classes
    const getCardStyle = () => cn(
        "transition-all duration-500",
        !isLampOn ? "bg-white/10 ring-1 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-black/40" : ""
    );

    if (isLoading || !user) {
        return <div className="flex h-full items-center justify-center text-zinc-500">Loading settings...</div>
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
                    <p className="text-zinc-400 mt-1">Manage your account and preferences.</p>
                </div>
            </div>

            {/* Profile Section */}
            <GlassCard className={cn("p-0", getCardStyle())}>
                <CardHeader className="border-b border-white/5 px-6 pt-6 pb-4">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-zinc-400" />
                        <CardTitle className="text-lg font-medium text-white">My Profile</CardTitle>
                    </div>
                    <CardDescription className="text-zinc-500">
                        Update your personal information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20 border-2 border-zinc-800">
                            <AvatarImage src={user.avatar} alt="@shadcn" />
                            <AvatarFallback>NO</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h3 className="font-medium text-white text-lg">{user.username}</h3>
                            <p className="text-sm text-zinc-500">Focus Mode: Engaged</p>
                            <Button variant="outline" size="sm" className="mt-2 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white">Change Avatar</Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-zinc-400">Username</Label>
                            {(() => {
                                const lastChange = user.last_username_change ? new Date(user.last_username_change) : null;
                                const now = new Date();
                                const diffTime = lastChange ? Math.abs(now.getTime() - lastChange.getTime()) : 0;
                                const daysPassed = lastChange ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 999;
                                const canChange = daysPassed >= 15;
                                const daysRemaining = 15 - daysPassed;

                                return (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className={!canChange ? "cursor-not-allowed opacity-80" : ""}>
                                                <Input
                                                    id="username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    disabled={!canChange}
                                                    className={cn(
                                                        "bg-black/20 border-zinc-800 text-white focus:border-indigo-500/50",
                                                        !canChange && "cursor-not-allowed text-zinc-500"
                                                    )}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        {!canChange && (
                                            <TooltipContent side="top" className="bg-white/10 backdrop-blur-md border-white/20 text-white rounded-full px-4 py-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                                <p>You can change your username again in {daysRemaining} days.</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                )
                            })()}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
                            <Input
                                id="email"
                                value={email}
                                disabled // Email update usually requires verification flow, disabling for simplicity as per requirements
                                className="bg-black/20 border-zinc-800 text-white focus:border-indigo-500/50 opacity-50 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-zinc-400" />
                            <h4 className="text-base font-medium text-white">Security</h4>
                        </div>
                        <Dialog open={isPasswordModalOpen} onOpenChange={(open) => {
                            setIsPasswordModalOpen(open);
                            if (!open) resetPasswordState();
                        }}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white font-mono">
                                    Change Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
                                <AnimatePresence mode="wait">
                                    {passwordStep === 1 ? (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <DialogHeader>
                                                <DialogTitle className="text-white">Enter Current Password</DialogTitle>
                                                <DialogDescription className="text-zinc-400">
                                                    Please verify your identity to continue.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current-pass" className="text-zinc-300">Current Password</Label>
                                                    <Input
                                                        type="password"
                                                        id="current-pass"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="bg-black/40 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-indigo-500/50"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handlePasswordSubmit} className="w-full bg-white text-black hover:bg-zinc-200">
                                                    Verify & Continue <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DialogFooter>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <DialogHeader>
                                                <DialogTitle className="text-white">Set New Password</DialogTitle>
                                                <DialogDescription className="text-zinc-400">
                                                    Choose a strong password for your account.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-pass" className="text-zinc-300">New Password</Label>
                                                    <Input
                                                        type="password"
                                                        id="new-pass"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="bg-black/40 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-indigo-500/50"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-pass" className="text-zinc-300">Confirm Password</Label>
                                                    <Input
                                                        type="password"
                                                        id="confirm-pass"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className={`bg-black/40 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 ${newPassword && confirmPassword && newPassword !== confirmPassword ? 'border-red-900/50' : ''}`}
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handlePasswordSubmit} className="w-full bg-white text-black hover:bg-zinc-200">
                                                    Update Password <Check className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DialogFooter>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </GlassCard>

            {/* Study Rhythm Section */}
            <GlassCard className={cn("p-0", getCardStyle())}>
                <CardHeader className="border-b border-white/5 px-6 pt-6 pb-4">
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-zinc-400" />
                        <CardTitle className="text-lg font-medium text-white">Study Rhythm</CardTitle>
                    </div>
                    <CardDescription className="text-zinc-500">
                        Optimize your schedule for maximum productivity.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="sleep-start" className="text-zinc-400 flex items-center gap-2">
                                <Moon className="h-4 w-4" /> Ideal Sleep Start
                            </Label>
                            <Input type="time" id="sleep-start" className="bg-black/20 border-zinc-800 text-white focus:border-indigo-500/50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wake-up" className="text-zinc-400 flex items-center gap-2">
                                <Sun className="h-4 w-4" /> Ideal Wake Up
                            </Label>
                            <Input type="time" id="wake-up" className="bg-black/20 border-zinc-800 text-white focus:border-indigo-500/50" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-zinc-400">Peak Alertness (10 PM - 6 AM)</Label>
                        <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>10 PM</span>
                            <span>2 AM</span>
                            <span>6 AM</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="long-term-goal" className="text-zinc-400 flex items-center gap-2">
                            <Target className="h-4 w-4" /> Long-term Goal
                        </Label>
                        <Input id="long-term-goal" placeholder="What are we working toward over the next 6 months?" className="bg-black/20 border-zinc-800 text-white focus:border-indigo-500/50" />
                    </div>
                </CardContent>
            </GlassCard>

            {/* Preferences Section */}
            <GlassCard className={cn("p-0", getCardStyle())}>
                <CardHeader className="border-b border-white/5 px-6 pt-6 pb-4">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-zinc-400" />
                        <CardTitle className="text-lg font-medium text-white">Preferences</CardTitle>
                    </div>
                    <CardDescription className="text-zinc-500">
                        Customize your app experience.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-zinc-200">Focus Mode</Label>
                            <p className="text-sm text-zinc-500">Select your distraction level.</p>
                        </div>
                        <Select defaultValue="dim">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dim">Dim</SelectItem>
                                <SelectItem value="distraction-free">Distraction-Free</SelectItem>
                                <SelectItem value="hardcore">Hardcore</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-zinc-200">Email Notifications</Label>
                            <p className="text-sm text-zinc-500">Receive weekly summaries of your productivity.</p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-zinc-200">Sound Effects</Label>
                            <p className="text-sm text-zinc-500">Play subtle sounds on task completion.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </GlassCard>

            {/* Danger Zone */}
            <GlassCard variant="ghost" className="border-red-900/20 bg-red-950/5 transition-all duration-500">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-400" />
                        <CardTitle className="text-lg font-medium text-red-400">Danger Zone</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-zinc-500">Permanently delete your account and all data.</p>
                        <Button variant="destructive" className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50">
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </GlassCard>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-white text-black hover:bg-zinc-200 font-medium px-8"
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
