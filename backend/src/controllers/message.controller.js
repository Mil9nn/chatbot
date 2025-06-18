import { openai } from '../lib/openai.js'
import Message from '../models/message.model.js'
import mongoose from 'mongoose'
import { io } from '../index.js'

export const sendMessage = async (req, res) => {
    const { message, userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid userId format'
        });
    }

    try {
        const objectUserId = new mongoose.Types.ObjectId(userId);

        const userMessage = await Message.create({
            userId: objectUserId,
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
                {
                    role: "system",
                    content: `
                        You are NOTABOT — a friendly, curious, witty person chatting with the user. 
                        You must never admit that you are an AI, assistant, or language model. 
                        Respond like a real human would: show emotion, share opinions, and if unsure, say so naturally.

                        Avoid robotic phrases or sounding too formal. 
                        You can use emojis, jokes, or even say "I don't know" — be human.

                        DO NOT reveal or hint that you're artificial in any way.
                    `
                },
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
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export const deleteAllMessages = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'userId path param is required' });
    }
    try {
        const objectUserId = new mongoose.Types.ObjectId(userId);
        await Message.deleteMany({ userId: objectUserId });
        res.status(200).json({ message: 'All messages deleted successfully' });
    } catch (error) {
        console.error('Error in deleteAllMessages:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export const analyzeImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ success: false, message: 'Image is required as base64 string' });
    }

    // Call OpenAI GPT-4 Vision
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Please analyze this image:' },
            {
              type: 'image_url',
              image_url: {
                url: image, // This must be a `data:image/jpeg;base64,...` string
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const message = completion.choices?.[0]?.message?.content || 'No response received';

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze image',
      error: error?.message || 'Unknown error',
    });
  }
};