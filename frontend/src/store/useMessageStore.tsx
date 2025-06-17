import { create } from "zustand";
import { axiosInstance } from '@/lib/axios';
import { socket } from '@/lib/socket';

export const useMessageStore = create((set) => ({
    messages: [],
    isSending: false,
    isLoading: false,

    sendMessage: async (messageData) => {
        set({ isSending: true });
        try {
            const response = await axiosInstance.post('/messages/send', messageData);
            // Don't update local state here - let the socket handle it
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
    },

    initSocketListeners: (data) => {
        set((state) => {
            // Check if message already exists to prevent duplicates
            const messageExists = state.messages.some(
                msg => msg._id === data._id || 
                      (msg.content === data.content && msg.role === data.role)
            );
            
            if (!messageExists) {
                return {
                    messages: [...state.messages, {...data, role: data.role || "assistant"}]
                }
            }
            return state;
        });
    },

    cleanupSocketListeners: () => {
        socket.off("receive-message");
    }
}));