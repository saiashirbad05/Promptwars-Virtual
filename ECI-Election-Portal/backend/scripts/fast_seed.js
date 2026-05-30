const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const firstNames = ['Aarav', 'Aditya', 'Arjun', 'Aryan', 'Ayaan', 'Atharv', 'Abhinav', 'Alok', 'Animesh', 'Ansh', 'Bhuvan', 'Chaitanya', 'Daksh', 'Darsh', 'Eklavya', 'Gautam', 'Harsh', 'Indrajeet', 'Jatin', 'Kunal', 'Lakshay', 'Madhav', 'Nakul', 'Ojas', 'Parth', 'Pranav', 'Raghav', 'Rishi', 'Samarth', 'Tanmay', 'Uday', 'Vatsal', 'Yash', 'Zuvin', 'Abhay', 'Amartya', 'Anirudh', 'Arvind', 'Balaji', 'Chandra', 'Dhanush', 'Eshwar', 'Ganesh', 'Hari', 'Ilayaraja', 'Jayasurya', 'Karthik', 'Lokesh', 'Madhavan', 'Nagarjun', 'Prithvi', 'Raghavan', 'Siddharth', 'Thala', 'Udhay', 'Vignesh', 'Vishnu', 'Yogesh', 'Zakir', 'Anand', 'Bhargav', 'Chetan', 'Deepak', 'Girish', 'Hemant', 'Jagdish', 'Kiran', 'Laxman', 'Mahesh', 'Nitin', 'Prakash', 'Rajesh', 'Suresh', 'Tarun', 'Utkarsh', 'Varun', 'Vimal', 'Vinay', 'Vivek', 'Yuvraj', 'Ashwin', 'Bharat', 'Dinesh', 'Gopal', 'Inder', 'Arijit', 'Biplab', 'Chinmay', 'Debashis', 'Indranil', 'Joydeep', 'Kaushik', 'Mainak', 'Niladri', 'Pallab', 'Ranajit', 'Subhabrata', 'Tathagata', 'Utsab', 'Abhijit', 'Anup', 'Barun', 'Chandan', 'Dilip', 'Gourab', 'Hirak', 'Jagannath', 'Kalyan', 'Manojit', 'Nayan', 'Paritosh', 'Ratan', 'Sajal', 'Tapash', 'Uttam', 'Amol', 'Baburao', 'Dattatray', 'Eknath', 'Gajanan', 'Harishchandra', 'Janardan', 'Keshav', 'Mahadev', 'Namdev', 'Pandurang', 'Raghunath', 'Sambhaji', 'Tukaram', 'Vithal', 'Yashwant', 'Anant', 'Bhalchandra', 'Dhondiba', 'Ganpat', 'Vikram', 'Rohan', 'Karan', 'Arnav', 'Kabir', 'Rudra', 'Dev', 'Shaurya', 'Aaryan', 'Advait', 'Abhishek', 'Akash', 'Aman', 'Amit', 'Anil', 'Ankur', 'Anuj', 'Arpit', 'Ashish', 'Ayush', 'Basant', 'Bimal', 'Bipin', 'Chirag', 'Deepesh', 'Dheeraj', 'Gaurav', 'Gautam', 'Girish', 'Gulshan', 'Harpreet', 'Himanshu', 'Ishwar', 'Jitendra', 'Kamal', 'Kapil', 'Kishore', 'Kuldeep', 'Lalit', 'Manish', 'Mayank', 'Mohit', 'Mukesh', 'Naveen', 'Neeraj', 'Nikhil', 'Nirmal', 'Pankaj', 'Pawan', 'Pradeep', 'Pramod', 'Prashant', 'Praveen', 'Puneet', 'Rahul', 'Rajiv', 'Rakesh', 'Ramesh', 'Ranbir', 'Ranjeet', 'Ravindra', 'Rishi', 'Rohit', 'Sachin', 'Sandeep', 'Sanjay', 'Sanjeev', 'Satish', 'Saurabh', 'Shakti', 'Shailendra', 'Shashank', 'Shravan', 'Shyam', 'Sumit', 'Sunil', 'Sushant', 'Tapan', 'Tarun', 'Tejas', 'Umesh', 'Upendra', 'Varun', 'Vicky', 'Vijay', 'Vikas', 'Vikrant', 'Vinod', 'Vipul', 'Vishal', 'Yogesh'];
const middleNames = ['Kumar', 'Singh', 'Chandra', 'Lal', 'Prasad', 'Nath', 'Kishore', 'Rao', 'Ram', 'Dev', 'Kant', 'Bhushan', 'Prakash', 'Raj', 'Swaroop', 'Dayal', 'Shankar', 'Charan', 'Das', 'Dutta'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Reddy', 'Choudhary', 'Thakur', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Shukla', 'Bajpai', 'Pathak', 'Tripathi', 'Dwivedi', 'Chaturvedi', 'Agrawal', 'Bansal', 'Goyal', 'Mittal', 'Maheshwari', 'Rathi', 'Sarin', 'Khanna', 'Malhotra', 'Kapoor', 'Seth', 'Batra', 'Chopra', 'Oberoi', 'Mehra', 'Suri', 'Vohra', 'Bakshi', 'Duggal', 'Soni', 'Iyer', 'Nair', 'Menon', 'Kulkarni', 'Deshpande', 'Joshi', 'Rao', 'Naidu', 'Shetty', 'Hegde', 'Pai', 'Nadarni', 'Prabhu', 'Kamath', 'Shenoy', 'Mallya', 'Nadar', 'Pillai', 'Gounder', 'Thevar', 'Chettiar', 'Vellalar', 'Mudaliar', 'Iyengar', 'Acharya', 'Bhat', 'Hebbar', 'Tantry', 'Puranik', 'Deshmukh', 'Patil', 'Gaikwad', 'Shinde', 'Pawar', 'Chavan', 'Jadhav', 'More', 'Suryavanshi', 'Bhosale', 'Kadam', 'Sawant', 'Thorat', 'Mohite', 'Wagh', 'Zende', 'Gade', 'Pisal', 'Dhumal', 'Jagtap', 'Shah', 'Mehta', 'Trivedi', 'Bhatt', 'Purohit', 'Vyas', 'Pandya', 'Thaker', 'Doshi', 'Mistry', 'Banerjee', 'Mukherjee', 'Chatterjee', 'Ganguly', 'Bose', 'Dutta', 'Das', 'Sarkar', 'Roy', 'Ghosh', 'Sen', 'Guha', 'Majumdar', 'Chakraborty', 'Bhowmick', 'Sanyal', 'Lahiri', 'Bagchi', 'Maitra', 'Halder', 'Barua', 'Sarma', 'Gogoi', 'Saikia', 'Borah', 'Talukdar', 'Kalita', 'Mahanta', 'Deka', 'Medhi', 'Khan', 'Sheikh', 'Ansari', 'Qureshi', 'Siddiqui', 'Mulla', 'Syed', 'Baig', 'Mirza', 'Ahmed', 'Prasad', 'Sinha', 'Sahay', 'Srivastava', 'Nigam', 'Johri', 'Tandon', 'Khatri', 'Malik', 'Abbasi', 'Adnan', 'Akhtar', 'Alvi', 'Asghar', 'Aziz', 'Bari', 'Dar', 'Faruqi', 'Gani', 'Hamid', 'Hashmi', 'Husain', 'Iqbal', 'Jafri', 'Javed', 'Kazmi', 'Latif', 'Mahmood', 'Majid', 'Mansuri', 'Masood', 'Nadeem', 'Pasha', 'Qadri', 'Rahman', 'Raza', 'Saeed', 'Salim', 'Sattar', 'Usmani', 'Wani', 'Yasin', 'Zafar', 'Zuberi', 'Aggarwal', 'Arora', 'Bhasin', 'Chhabra', 'Dhawan', 'Grover', 'Handa', 'Jaitly', 'Kalra', 'Luthra', 'Munjal', 'Nagpal', 'Ojha', 'Puri', 'Rana', 'Sahni', 'Talwar', 'Uppal', 'Vasudeva', 'Wadhwa'];
const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
const parties = ['BJP', 'INC', 'AAP', 'BSP', 'SP', 'AITC', 'DMK', 'IND', 'BJD', 'CPIM', 'Shiv Sena'];

async function fastSeed() {
  console.log('Cleaning up tables...');
  await prisma.candidate.deleteMany();
  await prisma.turnout.deleteMany();

  console.log('Generating unique names...');
  const names = new Set();
  while (names.size < 100000) {
    const f = firstNames[Math.floor(Math.random() * firstNames.length)];
    const m = Math.random() > 0.5 ? middleNames[Math.floor(Math.random() * middleNames.length)] + ' ' : '';
    const l = lastNames[Math.floor(Math.random() * lastNames.length)];
    names.add(`${f} ${m}${l}`);
  }
  const nameList = Array.from(names);
  
  // Shuffle nameList for non-alphabetical order
  for (let i = nameList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nameList[i], nameList[j]] = [nameList[j], nameList[i]];
  }

  console.log('Seeding Candidates (100k)...');
  const batchSize = 10000;
  for (let i = 0; i < 100000; i += batchSize) {
    const batch = [];
    for (let j = 0; j < batchSize; j++) {
      const idx = i + j;
      const state = states[Math.floor(Math.random() * states.length)];
      batch.push({
        name: nameList[idx],
        party: parties[Math.floor(Math.random() * parties.length)],
        constituency: `${state} Const. ${idx + 1}`,
        state: state,
        assets: BigInt(Math.floor(Math.random() * 500000000)),
        education: 'Graduate',
        year: 2024
      });
    }
    await prisma.candidate.createMany({ data: batch });
    console.log(`Seeded ${i + batchSize} candidates...`);
  }

  console.log('Seeding Turnout data...');
  const turnoutData = states.map(state => ({
    state,
    constituency: 'Aggregate',
    predicted: 60 + Math.random() * 15,
    actual: 55 + Math.random() * 20
  }));
  await prisma.turnout.createMany({ data: turnoutData });

  console.log('SUCCESS: Fast Seed Complete!');
  process.exit(0);
}

fastSeed();
