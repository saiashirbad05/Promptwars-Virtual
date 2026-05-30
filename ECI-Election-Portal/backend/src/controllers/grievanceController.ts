import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const createGrievance = async (req: Request, res: Response) => {
  try {
    const grievance = await prisma.grievance.create({
      data: req.body
    });
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to file grievance' });
  }
};
