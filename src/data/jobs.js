export const jobs = [
  // --- REMOTE & GLOBAL TECH ---
  { id: 1, title: 'Senior Frontend Engineer', company: 'Vercel', source: 'Remote OK', location: 'Remote', match: 99, salary: '$180k - $250k', tags: ['React', 'Next.js', 'TS'], url: 'https://vercel.com/careers' },
  { id: 2, title: 'Product Designer', company: 'Linear', source: 'Wellfound', location: 'Remote', match: 96, salary: '$140k - $210k', tags: ['Product', 'Figma', 'UI'], url: 'https://linear.app/careers' },
  { id: 3, title: 'Fullstack Developer', company: 'Stripe', source: 'LinkedIn', location: 'Global', match: 94, salary: '$160k - $230k', tags: ['Ruby', 'React', 'API'], url: 'https://stripe.com/jobs' },
  { id: 4, title: 'Platform Engineer', company: 'GitHub', source: 'Working Nomads', location: 'Remote', match: 97, salary: '$170k - $240k', tags: ['Go', 'Kubernetes'], url: 'https://github.com/about/careers' },
  { id: 5, title: 'Security Architect', company: 'Cloudflare', source: 'Hired.com', location: 'Global', match: 92, salary: '$190k - $280k', tags: ['Rust', 'Network'], url: 'https://www.cloudflare.com/careers/' },
  { id: 6, title: 'DevOps Lead', company: 'Hashicorp', source: 'Remote OK', location: 'Remote', match: 95, salary: '$165k - $245k', tags: ['Terraform', 'Vault'], url: 'https://www.hashicorp.com/jobs' },
  { id: 7, title: 'AI Research Engineer', company: 'OpenAI', source: 'Direct', location: 'Remote', match: 91, salary: '$300k - $500k', tags: ['Python', 'PyTorch', 'LLM'], url: 'https://openai.com/careers' },
  { id: 8, title: 'Backend Engineer (Go)', company: 'Uber', source: 'Dice.com', location: 'USA / Remote', match: 89, salary: '$175k - $255k', tags: ['Go', 'Microservices'], url: 'https://www.uber.com/careers/' },
  { id: 9, title: 'Frontend Specialist', company: 'Airbnb', source: 'LinkedIn', location: 'Global', match: 98, salary: '$160k - $240k', tags: ['React', 'CSS-in-JS'], url: 'https://www.airbnb.com/careers' },
  { id: 10, title: 'Cloud Solutions Architect', company: 'AWS', source: 'Indeed', location: 'Global', match: 93, salary: '$185k - $275k', tags: ['AWS', 'Architecture'], url: 'https://amazon.jobs' },

  // --- INDIA SECTOR ---
  { id: 21, title: 'SDE-2 Fullstack', company: 'Razorpay', source: 'Naukri', location: 'India', match: 98, salary: '₹25L - ₹45L', tags: ['Node.js', 'React'], url: 'https://razorpay.com/jobs/' },
  { id: 22, title: 'Backend Engineer', company: 'Cred', source: 'Instahyre', location: 'Bangalore', match: 95, salary: '₹30L - ₹55L', tags: ['Go', 'Postgres'], url: 'https://cred.club/careers' },
  { id: 23, title: 'Senior Frontend Dev', company: 'Zomato', source: 'Cutshort', location: 'Gurgaon', match: 92, salary: '₹22L - ₹40L', tags: ['React', 'React Native'], url: 'https://www.zomato.com/careers' },
  { id: 24, title: 'Software Engineer', company: 'Flipkart', source: 'Foundit India', location: 'Bangalore', match: 88, salary: '₹20L - ₹38L', tags: ['Java', 'Spring'], url: 'https://www.flipkartcareers.com' },
  { id: 25, title: 'DevOps Specialist', company: 'Paytm', source: 'Hirist', location: 'Noida', match: 90, salary: '₹25L - ₹42L', tags: ['AWS', 'Jenkins'], url: 'https://paytm.com/careers/' },
  { id: 26, title: 'Mobile Developer', company: 'PhonePe', source: 'LinkedIn', location: 'India', match: 94, salary: '₹28L - ₹48L', tags: ['Kotlin', 'Swift'], url: 'https://www.phonepe.com/careers/' },
  { id: 27, title: 'Fullstack Lead', company: 'Freshworks', source: 'SimplyHired', location: 'Chennai', match: 91, salary: '₹35L - ₹60L', tags: ['Ruby', 'Ember.js'], url: 'https://www.freshworks.com/careers' },

  // --- USA SECTOR ---
  { id: 41, title: 'Software Engineer', company: 'Google', source: 'Dice', location: 'Mountain View', match: 85, salary: '$180k - $310k', tags: ['C++', 'Python'], url: 'https://careers.google.com' },
  { id: 42, title: 'Data Scientist', company: 'Meta', source: 'Glassdoor', location: 'Menlo Park', match: 87, salary: '$170k - $290k', tags: ['Python', 'SQL'], url: 'https://www.metacareers.com' },
  { id: 43, title: 'Cloud Infrastructure', company: 'Microsoft', source: 'Monster', location: 'Seattle', match: 82, salary: '$165k - $285k', tags: ['Azure', 'C#'], url: 'https://careers.microsoft.com' },
  { id: 44, title: 'Fintech Dev', company: 'Plaid', source: 'BuiltIn', location: 'San Francisco', match: 96, salary: '$175k - $265k', tags: ['React', 'API'], url: 'https://plaid.com/careers' },
  { id: 45, title: 'Core Engineer', company: 'DoorDash', source: 'Snagajob', location: 'USA', match: 84, salary: '$160k - $250k', tags: ['Kotlin', 'AWS'], url: 'https://careers.doordash.com' },

  // --- UK / EUROPE ---
  { id: 61, title: 'Junior Frontend Developer', company: 'Revolut', source: 'Reed.co.uk', location: 'London', match: 99, salary: '£45k - £75k', tags: ['React', 'Testing'], url: 'https://www.revolut.com/careers' },
  { id: 62, title: 'Backend Architect', company: 'Monzo', source: 'Totaljobs', location: 'London / Remote', match: 93, salary: '£90k - £140k', tags: ['Go', 'Cassandra'], url: 'https://monzo.com/careers' },
  { id: 63, title: 'Vue.js Developer', company: 'Spotify', source: 'Stepstone', location: 'Stockholm', match: 88, salary: '€70k - €110k', tags: ['Vue', 'JS'], url: 'https://www.lifeatspotify.com/jobs' },
  { id: 64, title: 'Cloud Tech Lead', company: 'Klarna', source: 'Adzuna', location: 'Berlin', match: 91, salary: '€90k - €150k', tags: ['Node', 'Cloud'], url: 'https://www.klarna.com/careers' },

  // --- ASIA / SINGAPORE ---
  { id: 81, title: 'Senior SDE', company: 'Grab', source: 'JobStreet', location: 'Singapore', match: 95, salary: '$8k - $14k SGD', tags: ['Go', 'Microservices'], url: 'https://grab.careers/' },
  { id: 82, title: 'Frontend Lead', company: 'Shopee', source: 'JobsDB', location: 'Singapore', match: 92, salary: '$9k - $15k SGD', tags: ['React', 'Webpack'], url: 'https://careers.shopee.sg/' },
  { id: 83, title: 'Product Manager', company: 'Lazada', source: 'Kalibrr', location: 'Bangkok', match: 87, salary: '$100k - $160k', tags: ['Agile', 'Product'], url: 'https://www.lazada.com/en/careers/' },

  // --- FREELANCE / REMOTE EXTRA ---
  { id: 101, title: 'React Consultant', company: 'TopTal', source: 'Toptal', location: 'Remote', match: 100, salary: '$100 - $180/hr', tags: ['React', 'Freelance'], url: 'https://www.toptal.com/resume' },
  { id: 102, title: 'UI UX Guru', company: 'Fiverr Pro', source: 'Fiverr', location: 'Remote', match: 91, salary: '$80 - $150/hr', tags: ['Figma', 'UI'], url: 'https://www.fiverr.com' },
  { id: 103, title: 'Expert Node Developer', company: 'Upwork', source: 'Upwork', location: 'Remote', match: 88, salary: '$70 - $130/hr', tags: ['Node', 'AWS'], url: 'https://www.upwork.com' },

  // Generating more entries to reach the target...
  ...Array.from({ length: 60 }).map((_, i) => ({
    id: 200 + i,
    title: ['SDE-3', 'Frontend Head', 'Staff Backend', 'VP Engineering', 'Systems Lead'][i % 5],
    company: ['Stripe', 'Vercel', 'Meta', 'Netflix', 'Tesla'][i % 5],
    source: ['AngelList', 'Lever', 'Greenhouse', 'SimplyHired', 'Monster'][i % 5],
    location: ['Remote', 'SF', 'London', 'Berlin', 'Tokyo'][i % 5],
    match: 80 + (i % 20),
    salary: '$150k - $280k',
    tags: ['React', 'System Design', 'Leadership'],
    url: 'https://wellfound.com/jobs'
  })),

  ...Array.from({ length: 60 }).map((_, i) => ({
    id: 300 + i,
    title: ['Fullstack Engineer', 'Mobile Architect', 'Data Ops', 'App Dev', 'Web Tech'][i % 5],
    company: ['Zoho', 'Infosys', 'TCS', 'Wipro', 'HCL'][i % 5],
    source: ['Naukri', 'Hirist', 'JobHai', 'Apna', 'TimesJobs'][i % 5],
    location: ['India', 'Bangalore', 'Mumbai', 'Noida', 'Pune'][i % 5],
    match: 75 + (i % 25),
    salary: '₹15L - ₹35L',
    tags: ['Java', 'Cloud', 'SQL'],
    url: 'https://www.naukri.com'
  }))
];
