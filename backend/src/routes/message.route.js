import express from 'express'
import OpenAI from "openai";
import { getMessages } from '../controllers/message.controller.js';
const client = new OpenAI();

const router = express.Router();

// User sends a message and a bot responds (openai)
router.post('/send', getMessages);

export default router;