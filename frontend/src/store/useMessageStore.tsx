import { axiosInstance } from '@/lib/axios';
import { create } from 'zustand'

export const useMessageStore = create((set) => ({
    messages: [],
    isSending: false,
    isLoading: false,

    sendMessage: async (messageData) => {
        set({ isSending: true });
        try {
            const response = await axiosInstance.post('/messages/send', messageData);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            set({ isSending: false });
        }
    },

    fetchAllMessages: async (userId) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/all/${userId}`);
            set({ messages: response.data });
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}))