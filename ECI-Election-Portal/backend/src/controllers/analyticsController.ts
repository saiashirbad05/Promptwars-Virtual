import { Request, Response } from 'express';

export const getCandidateAnalytics = async (req: Request, res: Response) => {
  try {
    const stats = {
      partyDistribution: [
        { name: 'BJP', value: 4200000 },
        { name: 'INC', value: 3200000 },
        { name: 'AAP', value: 1100000 },
        { name: 'OTH', value: 2043000 }
      ],
      assetDistribution: [
        { range: '0-10L', count: 4500000 },
        { range: '10L-1Cr', count: 3500000 },
        { range: '1Cr-10Cr', count: 2000000 },
        { range: '10Cr+', count: 543000 }
      ],
      educationStats: [
        { level: 'Graduate+', percentage: 65 },
        { level: 'Secondary', percentage: 25 },
        { level: 'Other', percentage: 10 }
      ]
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
