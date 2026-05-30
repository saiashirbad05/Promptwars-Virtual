import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes/api';
import * as aiService from '../services/aiService';

// Mock the AI service
jest.mock('../services/aiService', () => ({
  getAIResponse: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('AI Chat API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return AI response for a valid message', async () => {
    (aiService.getAIResponse as jest.Mock).mockResolvedValue('Hello, how can I help?');

    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Hi', history: [] });

    expect(res.status).toBe(200);
    expect(res.body.response).toBe('Hello, how can I help?');
  });

  it('should return 400 if message is missing', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ history: [] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Message is required');
  });

  it('should return 500 if AI service fails', async () => {
    (aiService.getAIResponse as jest.Mock).mockRejectedValue(new Error('AI Service Error'));

    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Hi' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('AI Service Error');
  });
});
