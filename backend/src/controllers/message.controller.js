import { openai } from '../lib/openai.js'

export const getMessages = async (req, res) => {
    console.log("I've reaced the getMessages controller");
    const { message, userId } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano-2025-04-14",
            messages: [
                { role: "user", content: message },
                { role: "system", content: "You are a helpful assistant."},

            ],
        })
        res.status(200).json({
            message: response.choices[0].message.content,
            userId: userId,
        });
        console.log("Message sent successfully", response.choices[0].message.content);
    } catch (error) {
        console.error("Error in send message route", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}