import { getAIResponse } from '../services/aiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai');

describe('AI Service', () => {
  let mockSendMessage: jest.Mock;
  let mockStartChat: jest.Mock;

  beforeEach(() => {
    mockSendMessage = jest.fn();
    mockStartChat = jest.fn().mockReturnValue({
      sendMessage: mockSendMessage
    });

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        startChat: mockStartChat
      })
    }));
  });

  it('should return text from Gemini API', async () => {
    // Mocking the result to be a promise that resolves to an object with a response promise
    const mockResponse = {
      text: () => 'Mock AI Response'
    };
    
    mockSendMessage.mockResolvedValue({
      response: Promise.resolve(mockResponse)
    });

    const response = await getAIResponse('Hello');
    expect(response).toBe('Mock AI Response');
  });

  it('should throw error if Gemini API fails', async () => {
    mockSendMessage.mockRejectedValue(new Error('API Failure'));

    await expect(getAIResponse('Hello')).rejects.toThrow('Failed to get response from AI Assistant');
  });
});
