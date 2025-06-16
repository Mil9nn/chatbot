import { axiosInstance } from '@/lib/axios'
import { create } from 'zustand'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: false,
    isLoggingIn: false,
    isSigningUp: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
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
                navigate('/');
                toast.success('Signup succcessful!');
            }
        } catch (error) {
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
                navigate('/');
                toast.success('Logged in succcessfuly!');
            }
        } catch (error) {
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
                toast.success("Logged out successfully");
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
}))