import express from 'express'
import OpenAI from "openai";
import { analyzeImage, deleteAllMessages, getAllMessages, sendMessage } from '../controllers/message.controller.js';
const client = new OpenAI();

const router = express.Router();

// User sends a message and a bot responds (openai)
router.post('/send', sendMessage);
router.get('/all/:userId', getAllMessages);
router.delete('/delete/:userId', deleteAllMessages);
router.post('/analyze-image', analyzeImage);

export default router;