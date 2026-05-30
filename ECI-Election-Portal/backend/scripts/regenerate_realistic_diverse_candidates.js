const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const firstNames = [
  'Aarav', 'Aditya', 'Arjun', 'Aryan', 'Ayaan', 'Atharv', 'Abhinav', 'Alok', 'Animesh', 'Ansh', 'Bhuvan', 'Chaitanya', 'Daksh', 'Darsh', 'Eklavya', 'Gautam', 'Harsh', 'Indrajeet', 'Jatin', 'Kunal', 'Lakshay', 'Madhav', 'Nakul', 'Ojas', 'Parth', 'Pranav', 'Raghav', 'Rishi', 'Samarth', 'Tanmay', 'Uday', 'Vatsal', 'Yash', 'Zuvin', 'Abhay', 'Amartya',
  'Anirudh', 'Arvind', 'Balaji', 'Chandra', 'Dhanush', 'Eshwar', 'Ganesh', 'Hari', 'Ilayaraja', 'Jayasurya', 'Karthik', 'Lokesh', 'Madhavan', 'Nagarjun', 'Prithvi', 'Raghavan', 'Siddharth', 'Thala', 'Udhay', 'Vignesh', 'Vishnu', 'Yogesh', 'Zakir', 'Anand', 'Bhargav', 'Chetan', 'Deepak', 'Girish', 'Hemant', 'Jagdish', 'Kiran', 'Laxman', 'Mahesh', 'Nitin', 'Prakash', 'Rajesh', 'Suresh', 'Tarun', 'Utkarsh', 'Varun', 'Vimal', 'Vinay', 'Vivek', 'Yuvraj', 'Ashwin', 'Bharat', 'Dinesh', 'Gopal', 'Inder',
  'Arijit', 'Biplab', 'Chinmay', 'Debashis', 'Indranil', 'Joydeep', 'Kaushik', 'Mainak', 'Niladri', 'Pallab', 'Ranajit', 'Subhabrata', 'Tathagata', 'Utsab', 'Abhijit', 'Anup', 'Barun', 'Chandan', 'Dilip', 'Gourab', 'Hirak', 'Jagannath', 'Kalyan', 'Manojit', 'Nayan', 'Paritosh', 'Ratan', 'Sajal', 'Tapash', 'Uttam', 'Amol', 'Baburao', 'Dattatray', 'Eknath', 'Gajanan', 'Harishchandra', 'Janardan', 'Keshav', 'Mahadev', 'Namdev', 'Pandurang', 'Raghunath', 'Sambhaji', 'Tukaram', 'Vithal', 'Yashwant', 'Anant', 'Bhalchandra', 'Dhondiba', 'Ganpat',
  'Vikram', 'Rohan', 'Karan', 'Arnav', 'Kabir', 'Rudra', 'Dev', 'Shaurya', 'Aaryan', 'Advait', 'Abhishek', 'Akash', 'Aman', 'Amit', 'Anil', 'Ankur', 'Anuj', 'Arpit', 'Ashish', 'Ayush', 'Basant', 'Bimal', 'Bipin', 'Chirag', 'Deepesh', 'Dheeraj', 'Gaurav', 'Gautam', 'Girish', 'Gulshan', 'Harpreet', 'Himanshu', 'Ishwar', 'Jitendra', 'Kamal', 'Kapil', 'Kishore', 'Kuldeep', 'Lalit', 'Manish', 'Mayank', 'Mohit', 'Mukesh', 'Naveen', 'Neeraj', 'Nikhil', 'Nirmal', 'Pankaj', 'Pawan', 'Pradeep', 'Pramod', 'Prashant', 'Praveen', 'Puneet', 'Rahul', 'Rajiv', 'Rakesh', 'Ramesh', 'Ranbir', 'Ranjeet', 'Ravindra', 'Rishi', 'Rohit', 'Sachin', 'Sandeep', 'Sanjay', 'Sanjeev', 'Satish', 'Saurabh', 'Shakti', 'Shailendra', 'Shashank', 'Shravan', 'Shyam', 'Siddharth', 'Sumit', 'Sunil', 'Sushant', 'Tapan', 'Tarun', 'Tejas', 'Umesh', 'Upendra', 'Varun', 'Vicky', 'Vijay', 'Vikas', 'Vikrant', 'Vinod', 'Vipul', 'Vishal', 'Yogesh',
  'Ananya', 'Diya', 'Pari', 'Saanvi', 'Angel', 'Aavya', 'Anika', 'Aaradhya', 'Priya', 'Sneha', 'Ishita', 'Myra', 'Kyra', 'Kiara', 'Sara', 'Zoya', 'Navya', 'Vanya', 'Shanaya', 'Ira', 'Aditi', 'Bhavya', 'Chhavi', 'Drishti', 'Esha', 'Falguni', 'Gauri', 'Hema', 'Indu', 'Jaya', 'Kavya', 'Lata', 'Meera', 'Nandini', 'Oviya', 'Payal', 'Riya', 'Sita', 'Tanu', 'Uma', 'Vani', 'Yashi', 'Zeenat', 'Amba', 'Bela', 'Charu', 'Daya', 'Ekta', 'Geeta', 'Heena', 'Amrita', 'Anjali', 'Ankita', 'Archana', 'Asha', 'Barkha', 'Bela', 'Chanda', 'Damini', 'Deepika', 'Divya', 'Garima', 'Gayatri', 'Ishani', 'Jyoti', 'Kajal', 'Kalpana', 'Kiran', 'Komal', 'Kumud', 'Laxmi', 'Madhu', 'Mamta', 'Manisha', 'Maya', 'Meghna', 'Mona', 'Monica', 'Namrata', 'Neelam', 'Neha', 'Nidhi', 'Nirmala', 'Nisha', 'Pallavi', 'Pooja', 'Poonam', 'Pratibha', 'Preeti', 'Priyanka', 'Radha', 'Rajni', 'Rakhi', 'Rashmi', 'Reena', 'Rekha', 'Renuka', 'Ritu', 'Roopa', 'Sadhana', 'Sakshi', 'Sandhya', 'Sangita', 'Sapna', 'Sarita', 'Seema', 'Shalu', 'Shanti', 'Sharda', 'Shikha', 'Shilpa', 'Shivani', 'Shobha', 'Shraddha', 'Shweta', 'Simran', 'Sonal', 'Sonia', 'Sudha', 'Suman', 'Sunita', 'Sushma', 'Swati', 'Tanya', 'Tulsi', 'Urmila', 'Usha', 'Vandana', 'Varsha', 'Vidya', 'Vimala', 'Yamini'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Reddy', 'Choudhary', 'Thakur', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Shukla', 'Bajpai', 'Pathak', 'Tripathi', 'Dwivedi', 'Chaturvedi', 'Agrawal', 'Bansal', 'Goyal', 'Mittal', 'Maheshwari', 'Rathi', 'Sarin', 'Khanna', 'Malhotra', 'Kapoor', 'Seth', 'Batra', 'Chopra', 'Oberoi', 'Mehra', 'Suri', 'Vohra', 'Bakshi', 'Duggal', 'Soni',
  'Iyer', 'Nair', 'Menon', 'Kulkarni', 'Deshpande', 'Joshi', 'Rao', 'Naidu', 'Shetty', 'Hegde', 'Pai', 'Nadarni', 'Prabhu', 'Kamath', 'Shenoy', 'Mallya', 'Nadar', 'Pillai', 'Gounder', 'Thevar', 'Chettiar', 'Vellalar', 'Mudaliar', 'Iyengar', 'Acharya', 'Bhat', 'Hebbar', 'Tantry', 'Puranik',
  'Deshmukh', 'Patil', 'Gaikwad', 'Shinde', 'Pawar', 'Chavan', 'Jadhav', 'More', 'Suryavanshi', 'Bhosale', 'Kadam', 'Sawant', 'Thorat', 'Mohite', 'Wagh', 'Zende', 'Gade', 'Pisal', 'Dhumal', 'Jagtap', 'Shah', 'Mehta', 'Trivedi', 'Bhatt', 'Purohit', 'Vyas', 'Pandya', 'Thaker', 'Doshi', 'Mistry',
  'Banerjee', 'Mukherjee', 'Chatterjee', 'Ganguly', 'Bose', 'Dutta', 'Das', 'Sarkar', 'Roy', 'Ghosh', 'Sen', 'Guha', 'Majumdar', 'Chakraborty', 'Bhowmick', 'Sanyal', 'Lahiri', 'Bagchi', 'Maitra', 'Halder', 'Barua', 'Sarma', 'Gogoi', 'Saikia', 'Borah', 'Talukdar', 'Kalita', 'Mahanta', 'Deka', 'Medhi',
  'Khan', 'Sheikh', 'Ansari', 'Qureshi', 'Siddiqui', 'Mulla', 'Syed', 'Baig', 'Mirza', 'Ahmed', 'Prasad', 'Sinha', 'Sahay', 'Srivastava', 'Nigam', 'Johri', 'Tandon', 'Khatri', 'Malik', 'Abbasi', 'Adnan', 'Akhtar', 'Alvi', 'Asghar', 'Aziz', 'Bari', 'Dar', 'Faruqi', 'Gani', 'Hamid', 'Hashmi', 'Husain', 'Iqbal', 'Jafri', 'Javed', 'Kazmi', 'Latif', 'Mahmood', 'Majid', 'Mansuri', 'Masood', 'Nadeem', 'Pasha', 'Qadri', 'Rahman', 'Raza', 'Saeed', 'Salim', 'Sattar', 'Usmani', 'Wani', 'Yasin', 'Zafar', 'Zuberi', 'Aggarwal', 'Arora', 'Bhasin', 'Chhabra', 'Dhawan', 'Grover', 'Handa', 'Jaitly', 'Kalra', 'Luthra', 'Munjal', 'Nagpal', 'Ojha', 'Puri', 'Rana', 'Sahni', 'Talwar', 'Uppal', 'Vasudeva', 'Wadhwa'
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal'
];

const parties = ['BJP', 'INC', 'AAP', 'BSP', 'SP', 'AITC', 'DMK', 'IND', 'BJD', 'CPIM', 'Shiv Sena'];

async function regenerate() {
  console.log('Cleaning up existing candidates...');
  await prisma.candidate.deleteMany();
  
  console.log('Generating 100,000 unique realistic Indian names...');
  const allNames = new Set();
  const targetCount = 100000;
  
  let lastLogged = 0;
  while (allNames.size < targetCount) {
    const f = firstNames[Math.floor(Math.random() * firstNames.length)];
    const l = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${f} ${l}`;
    
    allNames.add(fullName);
    
    if (allNames.size >= lastLogged + 20000) {
      lastLogged = allNames.size;
      console.log(`Generated ${allNames.size} realistic combinations...`);
    }
  }

  const nameList = Array.from(allNames);
  // SHUFFLE nameList to ensure "A... Y... S..." pattern
  for (let i = nameList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nameList[i], nameList[j]] = [nameList[j], nameList[i]];
  }

  console.log('Seeding database with realistic data...');
  const batchSize = 5000;
  let totalSeeded = 0;

  for (let i = 0; i < targetCount / batchSize; i++) {
    const candidates = [];
    for (let j = 0; j < batchSize; j++) {
      const index = totalSeeded + j;
      const state = states[Math.floor(Math.random() * states.length)];
      
      candidates.push({
        name: nameList[index],
        party: parties[Math.floor(Math.random() * parties.length)],
        constituency: `${state} Const. ${index + 1}`,
        state: state,
        electionType: 'LOK_SABHA',
        assets: BigInt(Math.floor(Math.random() * 900000000) + 1000000),
        criminalCases: Math.random() < 0.1 ? Math.floor(Math.random() * 5) : 0,
        education: ['Graduate', 'Post Graduate', 'Doctorate', '12th Pass'][Math.floor(Math.random() * 4)],
        year: 2024
      });
    }
    await prisma.candidate.createMany({ data: candidates });
    totalSeeded += batchSize;
    console.log(`Seeded ${totalSeeded} candidates...`);
  }
  
  console.log('SUCCESS: 100,000 Realistic Indian Candidates seeded (Zero Repeats, Random Order)!');
  process.exit(0);
}

regenerate();
