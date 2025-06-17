import { create } from "zustand";
import { axiosInstance } from '@/lib/axios';
import { socket } from '@/lib/socket';
import toast from "react-hot-toast";

type MessageRole = 'user' | 'assistant'; // More specific type

interface Message {
    _id: string;
    userId: string;
    content: string;
    role: MessageRole;
    createdAt: string;
}

interface SendMessageParams {
    userId: string;
    message: string;
}

interface MessageStore {
    messages: Message[];
    isSending: boolean;
    isLoading: boolean;
    error: string | null;

    sendMessage: (params: SendMessageParams) => Promise<void>;
    fetchAllMessages: (userId: string) => Promise<void>;
    deleteAllMessages: (userId: string) => Promise<void>;
    initSocketListeners: (data: unknown) => void; // Changed to unknown for safer typing
    cleanupSocketListeners: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
    messages: [],
    isSending: false,
    isLoading: false,
    error: null,

    sendMessage: async (messageData) => {
        set({ isSending: true, error: null });
        try {
            await axiosInstance.post('/messages/send', messageData);
        } catch (error) {
            set({ error: 'Failed to send message' });
            console.error('Error sending message:', error);
        } finally {
            set({ isSending: false });
        }
    },

    fetchAllMessages: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/messages/all/${userId}`);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to load messages');
            }

            set({
                messages: response.data.data || []
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to load messages',
                messages: []
            });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteAllMessages: async (userId) => {
        try {
            await axiosInstance.delete(`/messages/delete/${userId}`);
            set({ messages: [] });
        } catch (error) {
            set({ error: 'Failed to clear chat' });
            console.error('Error clearing chat history:', error);
            toast.error('Failed to clear chat history');
        }
    },

    initSocketListeners: (data: unknown) => {
        if (!data || typeof data !== 'object') return;

        const message = data as {
            _id?: string;
            userId?: string;
            role?: string;
            content?: string;
            createdAt?: string;
        };

        if (!message._id || !message.content || !message.role) {
            console.warn('Received incomplete message:', data);
            return;
        }

        set((state) => {
            const newMessage = {
                _id: message._id || Math.random().toString(),
                userId: message.userId || '',
                content: message.content || '',
                role: message.role === 'user' ? 'user' : 'assistant',
                createdAt: message.createdAt || new Date().toISOString()
            };

            return {
                ...state, // Keep all existing state
                messages: [...state.messages, newMessage]
            } as MessageStore; // <-- This is the magic line
        });
    },

    cleanupSocketListeners: () => {
        socket.off("receive-message");
    }
}));