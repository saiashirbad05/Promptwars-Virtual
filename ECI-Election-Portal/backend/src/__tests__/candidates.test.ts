import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes/api';
import prisma from '../services/prisma';

jest.mock('../services/prisma', () => ({
  __esModule: true,
  default: {
    candidate: {
      findMany: jest.fn(),
      count: jest.fn(),
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Candidates API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch candidates', async () => {
    (prisma.candidate.findMany as jest.Mock).mockResolvedValue([{ id: '1', assets: BigInt(100) }]);
    (prisma.candidate.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/api/candidates');
    expect(res.status).toBe(200);
    expect(res.body.candidates[0].assets).toBe(100);
  });

  it('should handle errors', async () => {
    (prisma.candidate.findMany as jest.Mock).mockRejectedValue(new Error('Fail'));
    const res = await request(app).get('/api/candidates');
    expect(res.status).toBe(500);
  });
});
