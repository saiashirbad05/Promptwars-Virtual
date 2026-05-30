import { PrismaClient } from '@prisma/client';
import { dotenv } from 'dotenv';
import { resolve } from 'path';

// Load env from root
require('dotenv').config({ path: resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

const FIRST_NAMES = ['Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Saanvi', 'Ananya', 'Ishani', 'Myra', 'Rahul', 'Priya', 'Amit', 'Suresh', 'Ramesh', 'Lata', 'Sunita', 'Rajesh', 'Vikram', 'Anil', 'Sunil', 'Kavita', 'Deepak', 'Sanjay', 'Manoj', 'Prakash', 'Arun'];
const LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Reddy', 'Nair', 'Mukherjee', 'Chatterjee', 'Khan', 'Yadav', 'Chauhan', 'Thakur', 'Deshmukh', 'Kulkarni', 'Joshi', 'Aggarwal', 'Bansal', 'Malhotra', 'Kapoor'];
const PARTIES = ['BJP', 'INC', 'AAP', 'BSP', 'SP', 'AITC', 'DMK', 'BJD', 'CPI(M)', 'NCP', 'TDP', 'YSRCP', 'IND'];
const EDUCATION = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Doctorate', 'LLB', 'MBA', 'MBBS', 'B.Tech'];
const ELECTION_TYPES = ['LOK_SABHA', 'RAJYA_SABHA', 'VIDHAN_SABHA', 'LOCAL_GOVT'];

async function main() {
  console.log('🚀 Starting massive seed for 10,000+ candidates...');
  
  // Clear existing candidates for a fresh start
  await prisma.candidate.deleteMany();
  
  const totalToGenerate = 10500;
  const batchSize = 1000;
  
  for (let i = 0; i < totalToGenerate; i += batchSize) {
    const candidates = [];
    const currentBatchSize = Math.min(batchSize, totalToGenerate - i);
    
    for (let j = 0; j < currentBatchSize; j++) {
      const state = INDIAN_STATES[Math.floor(Math.random() * INDIAN_STATES.length)];
      const party = PARTIES[Math.floor(Math.random() * PARTIES.length)];
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const electionType = ELECTION_TYPES[Math.floor(Math.random() * ELECTION_TYPES.length)];
      
      candidates.push({
        name: `${firstName} ${lastName}`,
        party: party,
        constituency: `${state} Const-${Math.floor(Math.random() * 50) + 1}`,
        state: state,
        electionType: electionType as any,
        phase: Math.floor(Math.random() * 7) + 1,
        year: 2024,
        assets: BigInt(Math.floor(Math.random() * 500000000) + 500000), // 5L to 50Cr
        criminalCases: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
        education: EDUCATION[Math.floor(Math.random() * EDUCATION.length)],
        socialTwitter: `https://twitter.com/${firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
        socialWebsite: `https://www.${firstName.toLowerCase()}${lastName.toLowerCase()}.in`
      });
    }
    
    await prisma.candidate.createMany({ data: candidates });
    console.log(`✅ Injected batch ${i / batchSize + 1} (${i + currentBatchSize}/${totalToGenerate})`);
  }
  
  console.log('🎉 Successfully seeded 10,500 candidates across all 36 states and UTs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
