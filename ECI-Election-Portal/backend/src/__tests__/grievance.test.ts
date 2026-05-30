import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes/api';
import { prismaMock } from './setup';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Grievance API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a grievance successfully', async () => {
    const mockGrievance = { id: 'G1', ticketId: 'T123', category: 'Fraud' };
    (prismaMock.grievance.create as jest.Mock).mockResolvedValue(mockGrievance);

    const res = await request(app)
      .post('/api/grievances')
      .send({ category: 'Fraud', description: 'Test' });

    expect(res.status).toBe(200);
    expect(res.body.ticketId).toBe('T123');
  });

  it('should return 500 if creation fails', async () => {
    (prismaMock.grievance.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

    const res = await request(app)
      .post('/api/grievances')
      .send({});

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to file grievance');
  });
});
