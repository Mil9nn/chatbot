import { openai } from '../lib/openai.js'
import Message from '../models/message.model.js'
import mongoose from 'mongoose'
import { io } from '../index.js'

export const sendMessage = async (req, res) => {
    const { message, userId } = req.body;
    try {
        const userMessage = await Message.create({
            userId: userId,
            role: "user",
            content: message,
        });

        // Emit user message to frontend
        io.emit('receive-message', {
            ...userMessage.toObject(),
            createdAt: new Date().toISOString()
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano-2025-04-14",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: message },
            ],
        })

        const botReply = response.choices[0].message.content;

        const botMessage = await Message.create({
            userId: userId,
            role: "assistant",
            content: botReply,
        })

        // Emit bot reply to frontend
        io.emit('receive-message', {
            ...botMessage.toObject(),
            createdAt: new Date().toISOString()
        });

        res.status(200).json({
            message: botReply,
            userId: userId,
        });

    } catch (error) {
        console.error("Error in send message route:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all messages for frontend rendering
export const getAllMessages = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'userId path param is required' });
    }

    try {
        const objectUserId = new mongoose.Types.ObjectId(userId);
        const messages = await Message.find({ userId: objectUserId }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error in getAllMessages:', error.message);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};