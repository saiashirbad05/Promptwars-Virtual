const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const firstNames = [
  'Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Aryan', 'Reyansh', 'Ishaan', 'Ayaan', 'Atharv', 'Krishna',
  'Ananya', 'Diya', 'Pari', 'Saanvi', 'Angel', 'Aavya', 'Anika', 'Aaradhya', 'Priya', 'Sneha',
  'Rajesh', 'Suresh', 'Amit', 'Sunil', 'Pankaj', 'Deepak', 'Manoj', 'Vijay', 'Rahul', 'Sanjay',
  'Meera', 'Ritu', 'Kavita', 'Sangeeta', 'Anita', 'Sunita', 'Rekha', 'Manju', 'Poonam', 'Shanti',
  'Mohammad', 'Abdul', 'Ahmed', 'Zaid', 'Omar', 'Hamza', 'Bilal', 'Mustafa', 'Yusuf', 'Ibrahim',
  'Vikram', 'Rohan', 'Karan', 'Arnav', 'Kabir', 'Rudra', 'Dev', 'Shaurya', 'Aaryan', 'Advait',
  'Ishita', 'Myra', 'Kyra', 'Kiara', 'Sara', 'Zoya', 'Navya', 'Vanya', 'Shanaya', 'Ira'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Reddy', 'Choudhary', 'Thakur',
  'Iyer', 'Nair', 'Menon', 'Kulkarni', 'Deshpande', 'Joshi', 'Bose', 'Chatterjee', 'Mukherjee', 'Banerjee',
  'Khan', 'Sheikh', 'Ansari', 'Qureshi', 'Siddiqui', 'Mulla', 'Deshmukh', 'Patil', 'Gaikwad', 'Shinde',
  'Agarwal', 'Bansal', 'Goyal', 'Mittala', 'Maheshwari', 'Rathi', 'Dutta', 'Das', 'Sarkar', 'Roy',
  'Prasad', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Shukla', 'Bajpai', 'Pathak', 'Tripathi', 'Dwivedi',
  'Mehta', 'Shah', 'Trivedi', 'Bhatt', 'Purohit', 'Rao', 'Naidu', 'Shetty', 'Hegde', 'Pai'
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal'
];

const parties = ['BJP', 'INC', 'AAP', 'BSP', 'SP', 'AITC', 'DMK', 'IND', 'BJD'];

async function regenerate() {
  console.log('Cleaning up existing candidates...');
  await prisma.candidate.deleteMany();
  
  console.log('Generating unique name combinations...');
  const allNames = [];
  for (const f of firstNames) {
    for (const l of lastNames) {
      for (let i = 0; i < 26; i++) {
        const middleInitial = String.fromCharCode(65 + i);
        allNames.push(`${f} ${middleInitial}. ${l}`);
      }
    }
  }

  // Shuffle names
  for (let i = allNames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allNames[i], allNames[j]] = [allNames[j], allNames[i]];
  }

  console.log(`Total unique names available: ${allNames.length}`);
  const targetCount = 100000;
  const batchSize = 5000;
  let totalGenerated = 0;

  for (let i = 0; i < targetCount / batchSize; i++) {
    const candidates = [];
    for (let j = 0; j < batchSize; j++) {
      const nameIndex = totalGenerated + j;
      const fullName = allNames[nameIndex];
      
      const state = states[Math.floor(Math.random() * states.length)];
      candidates.push({
        name: fullName,
        party: parties[Math.floor(Math.random() * parties.length)],
        constituency: `${state} Const. ${nameIndex + 1}`,
        state: state,
        electionType: 'LOK_SABHA',
        assets: BigInt(Math.floor(Math.random() * 500000000)),
        criminalCases: Math.floor(Math.random() * 5),
        education: ['Graduate', 'Post Graduate', 'Doctorate', '12th Pass', '10th Pass'][Math.floor(Math.random() * 5)],
        year: 2024
      });
    }
    await prisma.candidate.createMany({ data: candidates });
    totalGenerated += batchSize;
    console.log(`Seeded ${totalGenerated} unique candidates...`);
  }
  
  console.log('Successfully regenerated 100,000 unique candidates (Zero Repeats)!');
  process.exit(0);
}

regenerate();
