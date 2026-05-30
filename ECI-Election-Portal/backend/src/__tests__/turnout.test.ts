import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes/api';
import prisma from '../services/prisma';

jest.mock('../services/prisma', () => ({
  __esModule: true,
  default: {
    turnout: {
      findMany: jest.fn(),
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Turnout API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch turnout', async () => {
    (prisma.turnout.findMany as jest.Mock).mockResolvedValue([{ id: '1', actual: 50, predicted: 60 }]);
    const res = await request(app).get('/api/turnout');
    expect(res.status).toBe(200);
  });

  it('should handle errors', async () => {
    (prisma.turnout.findMany as jest.Mock).mockRejectedValue(new Error('Fail'));
    const res = await request(app).get('/api/turnout');
    expect(res.status).toBe(500);
  });
});
