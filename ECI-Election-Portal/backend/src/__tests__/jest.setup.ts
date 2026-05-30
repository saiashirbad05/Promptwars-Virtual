import prisma from '../services/prisma';

jest.mock('../services/prisma', () => ({
  __esModule: true,
  default: {
    candidate: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    turnout: {
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    grievance: {
      create: jest.fn(),
    },
    voterRegistration: {
      create: jest.fn(),
      findUnique: jest.fn(),
    }
  },
}));

export const prismaMock = prisma as any;
