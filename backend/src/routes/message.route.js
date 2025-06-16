import express from 'express'
import OpenAI from "openai";
import { getAllMessages, sendMessage } from '../controllers/message.controller.js';
const client = new OpenAI();

const router = express.Router();

// User sends a message and a bot responds (openai)
router.post('/send', sendMessage);
router.get('/all/:userId', getAllMessages);

export default router;