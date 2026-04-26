export const jobs = [
  // --- TOP GLOBAL DEEP LINKS ---
  { id: 1, title: 'Senior Frontend Engineer', company: 'Vercel', source: 'Direct', location: 'Remote', match: 99, salary: '$180k - $250k', tags: ['React', 'Next.js'], url: 'https://vercel.com/jobs/senior-frontend-engineer' },
  { id: 2, title: 'Staff Product Designer', company: 'Linear', source: 'Direct', location: 'Remote', match: 96, salary: '$190k - $240k', tags: ['Figma', 'UI'], url: 'https://linear.app/careers/product-designer' },
  { id: 3, title: 'Software Engineer, Payments', company: 'Stripe', source: 'LinkedIn', location: 'Global / Remote', match: 94, salary: '$170k - $260k', tags: ['Ruby', 'React'], url: 'https://stripe.com/jobs/listing/software-engineer-payments/123456' },
  { id: 4, title: 'Principal Platform Engineer', company: 'GitHub', source: 'Direct', location: 'Remote', match: 97, salary: '$200k - $300k', tags: ['Go', 'K8s'], url: 'https://github.com/about/careers/principal-platform-engineer' },

  // --- INDIA DEEP LINKS ---
  { id: 21, title: 'SDE-2 (React/Node)', company: 'Razorpay', source: 'Instahyre', location: 'Bangalore', match: 98, salary: '₹35L - ₹55L', tags: ['Node.js', 'React'], url: 'https://razorpay.com/jobs/sde-2-react-node-bangalore' },
  { id: 22, title: 'Lead Backend Developer', company: 'Cred', source: 'Direct', location: 'Bangalore', match: 95, salary: '₹45L - ₹75L', tags: ['Go', 'Postgres'], url: 'https://cred.club/careers/lead-backend-developer' },
  { id: 23, title: 'Frontend Architect', company: 'Zomato', source: 'Cutshort', location: 'Gurgaon', match: 92, salary: '₹40L - ₹65L', tags: ['React', 'Architecture'], url: 'https://www.zomato.com/careers/frontend-architect-gurgaon' },

  // --- USA DEEPS ---
  { id: 41, title: 'Senior AI Engineer', company: 'OpenAI', source: 'XpatJobs', location: 'San Francisco', match: 91, salary: '$350k - $550k', tags: ['Python', 'LLM'], url: 'https://openai.com/careers/senior-ai-engineer' },

  // Generating variety of simulated deep-links...
  ...Array.from({ length: 50 }).map((_, i) => {
    const roles = ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'App Dev'];
    const companies = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Tesla', 'SpaceX'];
    const r = roles[i % 5];
    const c = companies[i % 7];
    return {
      id: 200 + i,
      title: `Senior ${r} Specialist`,
      company: c,
      source: 'Internal Feed',
      location: 'Remote / Hybrid',
      match: 85 + (i % 15),
      salary: '$160k - $290k',
      tags: [r, 'Cloud', 'System Design'],
      url: `https://${c.toLowerCase()}.com/careers/job/${r.toLowerCase().replace(' ', '-')}-${i}`
    };
  }),

  ...Array.from({ length: 50 }).map((_, i) => {
    const roles = ['Software Engineer', 'Technical Lead', 'Associate Dev', 'QA Automator'];
    const companies = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant'];
    const r = roles[i % 4];
    const c = companies[i % 5];
    return {
      id: 300 + i,
      title: `${r} - Strategic Hub`,
      company: c,
      source: 'Naukri Hub',
      location: 'India / Hybrid',
      match: 80 + (i % 20),
      salary: '₹12L - ₹32L',
      tags: ['Java', 'SQL', 'Agile'],
      url: `https://www.naukri.com/job-listings-${r.toLowerCase().replace(' ', '-')}-${c.toLowerCase()}-${i}`
    };
  })
];
