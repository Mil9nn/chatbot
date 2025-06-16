import { axiosInstance } from '@/lib/axios'
import { create } from 'zustand'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isAuthenticating: null,

    checkAuth: async () => {
        set({ isAuthenticating: true });
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isAuthenticating: false });
        }
    },

    signup: async (formData, navigate) => {
        set({ isAuthenticating: true });
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
            set({ isAuthenticating: false });
        }
    },

    login: async (formData, navigate) => {
        set({ isAuthenticating: true });
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
            set({ isAuthenticating: false });
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