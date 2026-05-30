const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const firstNames = [
  // North/Central
  'Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Aryan', 'Reyansh', 'Ishaan', 'Ayaan', 'Atharv', 'Krishna',
  'Vikram', 'Rohan', 'Karan', 'Arnav', 'Kabir', 'Rudra', 'Dev', 'Shaurya', 'Aaryan', 'Advait',
  'Abhinav', 'Alok', 'Animesh', 'Ansh', 'Bhuvan', 'Chaitanya', 'Daksh', 'Darsh', 'Eklavya', 'Gautam',
  'Harsh', 'Indrajeet', 'Jatin', 'Kunal', 'Lakshay', 'Madhav', 'Nakul', 'Ojas', 'Parth', 'Pranav',
  'Raghav', 'Rishi', 'Samarth', 'Tanmay', 'Uday', 'Vatsal', 'Yash', 'Zuvin', 'Abhay', 'Amartya',
  // South
  'Adithya', 'Anirudh', 'Arvind', 'Balaji', 'Chandra', 'Dhanush', 'Eshwar', 'Ganesh', 'Hari', 'Ilayaraja',
  'Jayasurya', 'Karthik', 'Lokesh', 'Madhavan', 'Nagarjun', 'Prithvi', 'Raghavan', 'Siddharth', 'Thala', 'Udhay',
  'Vignesh', 'Vishnu', 'Yogesh', 'Zakir', 'Anand', 'Bhargav', 'Chetan', 'Deepak', 'Girish', 'Hemant',
  'Jagdish', 'Kiran', 'Laxman', 'Mahesh', 'Nitin', 'Prakash', 'Rajesh', 'Suresh', 'Tarun', 'Utkarsh',
  'Varun', 'Vimal', 'Vinay', 'Vivek', 'Yuvraj', 'Ashwin', 'Bharat', 'Dinesh', 'Gopal', 'Inder',
  // East/West
  'Arijit', 'Biplab', 'Chinmay', 'Debashis', 'Indranil', 'Joydeep', 'Kaushik', 'Mainak', 'Niladri', 'Pallab',
  'Ranajit', 'Subhabrata', 'Tathagata', 'Utsab', 'Abhijit', 'Anup', 'Barun', 'Chandan', 'Dilip', 'Gourab',
  'Hirak', 'Jagannath', 'Kalyan', 'Manojit', 'Nayan', 'Paritosh', 'Ratan', 'Sajal', 'Tapash', 'Uttam',
  'Amol', 'Baburao', 'Dattatray', 'Eknath', 'Gajanan', 'Harishchandra', 'Janardan', 'Keshav', 'Mahadev', 'Namdev',
  'Pandurang', 'Raghunath', 'Sambhaji', 'Tukaram', 'Vithal', 'Yashwant', 'Anant', 'Bhalchandra', 'Dhondiba', 'Ganpat',
  // Female
  'Ananya', 'Diya', 'Pari', 'Saanvi', 'Angel', 'Aavya', 'Anika', 'Aaradhya', 'Priya', 'Sneha',
  'Ishita', 'Myra', 'Kyra', 'Kiara', 'Sara', 'Zoya', 'Navya', 'Vanya', 'Shanaya', 'Ira',
  'Aditi', 'Bhavya', 'Chhavi', 'Drishti', 'Esha', 'Falguni', 'Gauri', 'Hema', 'Indu', 'Jaya',
  'Kavya', 'Lata', 'Meera', 'Nandini', 'Oviya', 'Payal', 'Riya', 'Sita', 'Tanu', 'Uma',
  'Vani', 'Yashi', 'Zeenat', 'Amba', 'Bela', 'Charu', 'Daya', 'Ekta', 'Geeta', 'Heena'
];

const lastNames = [
  // North
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Reddy', 'Choudhary', 'Thakur',
  'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Shukla', 'Bajpai', 'Pathak', 'Tripathi', 'Dwivedi', 'Chaturvedi',
  'Agrawal', 'Bansal', 'Goyal', 'Mittal', 'Maheshwari', 'Rathi', 'Sarin', 'Khanna', 'Malhotra', 'Kapoor',
  'Seth', 'Batra', 'Chopra', 'Oberoi', 'Mehra', 'Suri', 'Vohra', 'Bakshi', 'Duggal', 'Soni',
  // South
  'Iyer', 'Nair', 'Menon', 'Kulkarni', 'Deshpande', 'Joshi', 'Reddy', 'Rao', 'Naidu', 'Shetty',
  'Hegde', 'Pai', 'Nadarni', 'Prabhu', 'Kamath', 'Shenoy', 'Mallya', 'Nadar', 'Pillai', 'Gounder',
  'Thevar', 'Chettiar', 'Vellalar', 'Mudaliar', 'Iyengar', 'Acharya', 'Bhat', 'Hebbar', 'Tantry', 'Puranik',
  // West
  'Deshmukh', 'Patil', 'Gaikwad', 'Shinde', 'Pawar', 'Chavan', 'Jadhav', 'More', 'Suryavanshi', 'Bhosale',
  'Kadam', 'Sawant', 'Thorat', 'Mohite', 'Wagh', 'Zende', 'Gade', 'Pisal', 'Dhumal', 'Jagtap',
  'Shah', 'Mehta', 'Trivedi', 'Bhatt', 'Purohit', 'Vyas', 'Pandya', 'Thaker', 'Doshi', 'Mistry',
  // East
  'Banerjee', 'Mukherjee', 'Chatterjee', 'Ganguly', 'Bose', 'Dutta', 'Das', 'Sarkar', 'Roy', 'Ghosh',
  'Sen', 'Guha', 'Majumdar', 'Chakraborty', 'Bhowmick', 'Sanyal', 'Lahiri', 'Bagchi', 'Maitra', 'Halder',
  'Barua', 'Sarma', 'Gogoi', 'Saikia', 'Borah', 'Talukdar', 'Kalita', 'Mahanta', 'Deka', 'Medhi',
  // Mixed/Common
  'Khan', 'Sheikh', 'Ansari', 'Qureshi', 'Siddiqui', 'Mulla', 'Syed', 'Baig', 'Mirza', 'Ahmed',
  'Prasad', 'Sinha', 'Sahay', 'Verma', 'Srivastava', 'Nigam', 'Johri', 'Tandon', 'Khatri', 'Malik'
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal'
];

const parties = ['BJP', 'INC', 'AAP', 'BSP', 'SP', 'AITC', 'DMK', 'IND', 'BJD', 'CPIM', 'NCP', 'Shiv Sena'];

async function regenerate() {
  console.log('Cleaning up existing candidates...');
  await prisma.candidate.deleteMany();
  
  console.log('Generating unique hyper-diverse name combinations...');
  const allNames = new Set();
  const targetCount = 100000;
  
  while (allNames.size < targetCount) {
    const f = firstNames[Math.floor(Math.random() * firstNames.length)];
    const l = lastNames[Math.floor(Math.random() * lastNames.length)];
    const m = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Middle Initial
    const pattern = Math.random();
    
    let fullName;
    if (pattern < 0.3) {
      fullName = `${f} ${l}`;
    } else if (pattern < 0.6) {
      fullName = `${f} ${m}. ${l}`;
    } else if (pattern < 0.8) {
      fullName = `${m}. ${f} ${l}`;
    } else {
      const f2 = firstNames[Math.floor(Math.random() * firstNames.length)];
      fullName = `${f} ${f2} ${l}`;
    }
    
    // Add a unique ID suffix in invisible way or just ensure uniqueness
    if (!allNames.has(fullName)) {
      allNames.add(fullName);
    }
    
    if (allNames.size % 10000 === 0) {
      console.log(`Generated ${allNames.size} unique combinations...`);
    }
  }

  const nameList = Array.from(allNames);
  // Shuffle nameList
  for (let i = nameList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nameList[i], nameList[j]] = [nameList[j], nameList[i]];
  }

  console.log('Seeding database with hyper-diverse data...');
  const batchSize = 2500;
  let totalSeeded = 0;

  for (let i = 0; i < targetCount / batchSize; i++) {
    const candidates = [];
    for (let j = 0; j < batchSize; j++) {
      const nameIndex = totalSeeded + j;
      const state = states[Math.floor(Math.random() * states.length)];
      
      candidates.push({
        name: nameList[nameIndex],
        party: parties[Math.floor(Math.random() * parties.length)],
        constituency: `${state} Const. ${nameIndex + 1}`,
        state: state,
        electionType: 'LOK_SABHA',
        assets: BigInt(Math.floor(Math.random() * 500000000) + 1000000),
        criminalCases: Math.random() < 0.1 ? Math.floor(Math.random() * 8) : 0,
        education: ['Graduate', 'Post Graduate', 'Doctorate', '12th Pass', '10th Pass', 'Professional Graduate'][Math.floor(Math.random() * 6)],
        year: 2024
      });
    }
    await prisma.candidate.createMany({ data: candidates });
    totalSeeded += batchSize;
    console.log(`Seeded ${totalSeeded} hyper-diverse candidates...`);
  }
  
  console.log('Successfully regenerated 100,000 hyper-diverse unique candidates (Zero Cross-Match)!');
  process.exit(0);
}

regenerate();
