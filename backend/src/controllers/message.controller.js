import { openai } from '../lib/openai.js'
import Message from '../models/message.model.js'
import mongoose from 'mongoose'

export const sendMessage = async (req, res) => {
    const { message, userId } = req.body;
    try {
        await Message.create({
            userId: userId,
            role: "user",
            content: message,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano-2025-04-14",
            messages: [
                { role: "user", content: message },
                { role: "system", content: "You are a helpful assistant." },

            ],
        })

        const botReply = response.choices[0].message.content;

        await Message.create({
            userId: userId,
            role: "assistant",
            content: botReply,
        })

        res.status(200).json({
            message: botReply,
            userId: userId,
        });

    } catch (error) {
        console.error("Error in send message route", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all messages for frontend rendering
export const getAllMessages = async (req, res) => {
    const { userId } = req.params;

    console.log('Raw userId from params:', userId);
    console.log('userId type:', typeof userId);
    console.log('userId length:', userId?.length);

    if (!userId) {
        return res.status(400).json({ message: 'userId path param is required' });
    }

    try {
        const objectUserId = new mongoose.Types.ObjectId(userId);
        console.log('Converted ObjectId:', objectUserId);

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