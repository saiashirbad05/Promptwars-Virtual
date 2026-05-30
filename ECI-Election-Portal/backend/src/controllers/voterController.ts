import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const registerVoter = async (req: Request, res: Response) => {
  const { name, email, phoneNo, aadhaarNo, voterId } = req.body;

  try {
    const voter = await prisma.voterRegistration.create({
      data: {
        name,
        email,
        phoneNo,
        aadhaarNo,
        voterId
      }
    });
    res.status(201).json(voter);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Aadhaar or Voter ID already registered.' });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
};

export const verifyVoter = async (req: Request, res: Response) => {
  const { voterId, birthday } = req.body;

  try {
    const voter = await prisma.voterRegistration.findUnique({
      where: { voterId }
    });

    if (voter) {
      // In a real app, we'd check birthday here. 
      // For now, we simulate success if the voter ID exists.
      res.status(200).json({ message: 'Verified', voter });
    } else {
      res.status(404).json({ error: 'Voter records not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};
