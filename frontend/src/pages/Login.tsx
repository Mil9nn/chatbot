import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const { login, isAuthenticating } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        login(formData, navigate);
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white">
            {/* Left Section - Login Form */}
            <div className="flex flex-1 items-center bg-white justify-end">
                <div className="w-full max-w-md h-[438px] bg-black lg:rounded-l-xl shadow-xl p-8">
                    <h2 className="text-4xl font-bold mb-6 text-center text-white">LogIn</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                onChange={handleChange}
                                type="email"
                                name="email"
                                id="email"
                                placeholder="johndoe32@example.com"
                                className="bg-zinc-900 pl-8 text-white placeholder:text-zinc-400"
                                required
                            />
                            <Mail className="absolute left-2 top-7.5 opacity-15 size-5" />
                        </div>

                        <div className="relative flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                onChange={handleChange}
                                type="password"
                                name="password"
                                id="password"
                                placeholder="At least 08 characters"
                                className="bg-zinc-900 pl-8 text-white placeholder:text-zinc-400"
                                required
                            />
                            <Lock className="absolute left-2 top-7.5 opacity-15 size-5" />
                        </div>
                        <Button type="submit" disabled={isAuthenticating} className="mt-2 bg-zinc-700 hover:bg-zinc-600 text-white">
                            {isAuthenticating ? (<Loader2 className="animate-spin" />) : (<span>Login</span>)}
                        </Button>
                        <p className="text-sm text-zinc-300 text-center">
                            Dont have an account?{" "}
                            <Link to="/signup" className="text-blue-400 hover:underline hover:text-blue-300 font-medium">
                                SignUp
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

export default Login;
