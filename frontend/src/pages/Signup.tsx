import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Signup = () => {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white">
            {/* Left Section - Signup Form */}
            <div className="flex flex-1 items-center bg-white justify-end">
                <div className="w-full max-w-md h-[438px] bg-black lg:rounded-l-xl shadow-xl p-8">
                    <h2 className="text-4xl font-bold mb-6 text-center text-white">Sign Up</h2>
                    <form className="flex flex-col gap-4">
                        <div className="relative flex flex-col gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="John Doe"
                            className="bg-zinc-900 pl-8 text-white placeholder:text-zinc-400"
                            required
                        />
                        <UserCircle className="absolute left-2 top-7.5 opacity-15 size-5" />
                        </div>

                        <div className="relative flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="johndoe32@example.com"
                                className="bg-zinc-900 pl-8 text-white placeholder:text-zinc-400"
                                required
                            />
                            <Mail className="absolute left-2 top-7.5 opacity-15 size-5"  />
                        </div>

                        <div className="relative flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="At least 08 characters"
                                className="bg-zinc-900 pl-8 text-white placeholder:text-zinc-400"
                                required
                            />
                            <Lock className="absolute left-2 top-7.5 opacity-15 size-5"  />
                        </div>
                        <Button type="submit" className="mt-2 bg-zinc-700 hover:bg-zinc-600 text-white">
                            Create Account
                        </Button>
                        <p className="text-sm text-zinc-300 text-center">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-400 hover:underline hover:text-blue-300 font-medium">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Section - Video */}
            <div className="flex bg-zinc-900 flex-1 items-center justify-start">
                <div className="w-full max-w-md shadow-xl">
                    <video
                        className="w-full h-auto lg:rounded-r-xl"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/bulb-animation.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
};

export default Signup;
