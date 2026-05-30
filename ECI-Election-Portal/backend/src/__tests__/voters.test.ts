import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes/api';
import prisma from '../services/prisma';

jest.mock('../services/prisma', () => ({
  __esModule: true,
  default: {
    voterRegistration: {
      create: jest.fn(),
      findUnique: jest.fn(),
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Voters API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register successfully', async () => {
    (prisma.voterRegistration.create as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).post('/api/voters/register').send({ name: 'test' });
    expect(res.status).toBe(201);
  });

  it('should handle duplicate error (P2002)', async () => {
    const error = new Error('Unique constraint');
    (error as any).code = 'P2002';
    (prisma.voterRegistration.create as jest.Mock).mockRejectedValue(error);
    const res = await request(app).post('/api/voters/register').send({});
    expect(res.status).toBe(400);
  });

  it('should verify successfully', async () => {
    (prisma.voterRegistration.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).post('/api/voters/verify').send({ voterId: 'V1' });
    expect(res.status).toBe(200);
  });

  it('should fail verification if not found', async () => {
    (prisma.voterRegistration.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).post('/api/voters/verify').send({ voterId: 'V1' });
    expect(res.status).toBe(404);
  });

  it('should handle general error', async () => {
    (prisma.voterRegistration.findUnique as jest.Mock).mockRejectedValue(new Error('Fail'));
    const res = await request(app).post('/api/voters/verify').send({ voterId: 'V1' });
    expect(res.status).toBe(500);
  });
});
