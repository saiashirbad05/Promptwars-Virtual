import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const getTurnout = async (req: Request, res: Response) => {
  try {
    const realTurnout = await prisma.turnout.findMany();
    const totalVoters = 1200000000;
    const scaledTurnout = realTurnout.map(t => ({
      ...t,
      actual: Math.floor(((t.actual || 0) / 100) * (totalVoters / 36)),
      prediction: Math.floor(((t.predicted || 0) / 100) * (totalVoters / 36)),
      totalPeople: totalVoters / 36
    }));
    res.json(scaledTurnout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch turnout data' });
  }
};
