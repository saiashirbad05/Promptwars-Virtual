import { Request, Response } from 'express';
import { getAIResponse } from '../services/aiService';

export const handleAIChat = async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const aiResponse = await getAIResponse(message, history);
    res.json({ response: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
