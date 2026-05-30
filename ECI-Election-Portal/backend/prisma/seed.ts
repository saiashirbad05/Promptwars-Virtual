const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Clear existing data
    await prisma.candidate.deleteMany();
    await prisma.turnout.deleteMany();

    // 2. Mock Candidates
    const candidates = [
      // Odisha
      { name: 'Naveen Patnaik', party: 'BJD', constituency: 'Hinjili', state: 'Odisha', assets: BigInt(650000000), criminalCases: 0, education: 'Graduate', photoUrl: 'https://img.etimg.com/thumb/msid-69345228,width-300,imgsize-124578,,resizemode-4,quality-100/naveen-patnaik.jpg' },
      { name: 'Dharmendra Pradhan', party: 'BJP', constituency: 'Sambalpur', state: 'Odisha', assets: BigInt(120000000), criminalCases: 0, education: 'MA', photoUrl: 'https://images.livemint.com/img/2024/06/09/600x338/Dharmendra_Pradhan_1717947113175_1717947113361.jpg' },
      
      // West Bengal
      { name: 'Mamata Banerjee', party: 'AITC', constituency: 'Bhabanipur', state: 'West Bengal', assets: BigInt(15000000), criminalCases: 0, education: 'MA, LLB', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Mamata_Banerjee_at_the_opening_ceremony_of_the_47th_International_Kolkata_Book_Fair.jpg' },
      
      // Delhi
      { name: 'Arvind Kejriwal', party: 'AAP', constituency: 'New Delhi', state: 'Delhi', assets: BigInt(34000000), criminalCases: 1, education: 'B.Tech', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Arvind_Kejriwal_%28cropped%29.jpg' },
      
      // Maharashtra
      { name: 'Devendra Fadnavis', party: 'BJP', constituency: 'Nagpur South West', state: 'Maharashtra', assets: BigInt(50000000), criminalCases: 2, education: 'Graduate Law', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Devendra_Fadnavis_%28cropped%29.jpg' },
    ];

    for (const c of candidates) {
      await prisma.candidate.create({ data: c });
    }

    // 3. Mock Turnout Data
    const turnoutData = [
      { state: 'Odisha', constituency: 'Puri', predicted: 72.5, actual: 74.2 },
      { state: 'West Bengal', constituency: 'Kolkata Dakshin', predicted: 68.0, actual: 70.5 },
      { state: 'Delhi', constituency: 'Chandni Chowk', predicted: 62.5, actual: null },
      { state: 'Maharashtra', constituency: 'Pune', predicted: 58.0, actual: null },
      { state: 'Tamil Nadu', constituency: 'Chennai South', predicted: 65.0, actual: 64.8 },
      { state: 'Karnataka', constituency: 'Bangalore Central', predicted: 54.0, actual: 55.2 },
      { state: 'Uttar Pradesh', constituency: 'Varanasi', predicted: 61.5, actual: null },
    ];

    for (const t of turnoutData) {
      await prisma.turnout.create({ data: t });
    }

    console.log('✅ Seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
