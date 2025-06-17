import { axiosInstance } from '@/lib/axios'
import { create } from 'zustand'
import toast from 'react-hot-toast'
import { socket } from '@/lib/socket'

import type { User } from '@/types/types.ts'

interface FormData {
    email: string;
    password: string;
    username?: string;
    confirmPassword?: string;
    fullName?: string;
}

interface AuthStore {
    authUser: User | null;
    isCheckingAuth: boolean;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    checkAuth: () => Promise<void>;
    signup: (formData: FormData, navigate: (path: string) => void) => Promise<void>;
    login: (formData: FormData, navigate: (path: string) => void) => Promise<void>;
    logout: (navigate: (path: string) => void) => Promise<void>; 
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isCheckingAuth: false,
    isLoggingIn: false,
    isSigningUp: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
            socket.connect();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formData, navigate) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post('/auth/signup', formData);
            if (response.status === 201) {
                set({ authUser: response.data });
                socket.connect();
                navigate('/');
                toast.success('Signup succcessful!');
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            toast.error(error.response?.data?.message || 'An error occcurred during signup');
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (formData, navigate) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/auth/login', formData);
            if (response.status === 201) { 
                set({ authUser: response.data });
                socket.connect();
                navigate('/');
                toast.success('Logged in succcessfuly!');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'An error occcurred during login');
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async (navigate) => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            if (res.status === 200) {
                set({ authUser: null });
                socket.disconnect();
                toast.success("Logged out successfully");
                navigate('/login');
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
}))