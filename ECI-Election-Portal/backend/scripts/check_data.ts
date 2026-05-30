import prisma from '../services/prisma';

async function check() {
  try {
    const candidateCount = await prisma.candidate.count();
    const turnoutCount = await prisma.turnout.count();
    const turnoutSamples = await prisma.turnout.findMany({ take: 5 });
    
    console.log('--- DATA AUDIT ---');
    console.log('Total Candidates:', candidateCount);
    console.log('Total Turnout Records:', turnoutCount);
    console.log('Turnout Samples:', JSON.stringify(turnoutSamples, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Audit failed:', e);
    process.exit(1);
  }
}

check();
