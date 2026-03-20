export const MOCK_MENTORS = [
  { id: 'm1', name: 'Sarah Jenkins', role: 'Senior Architect', email: 's.jenkins@oneconnect.vn' },
  { id: 'm2', name: 'Marcus Chen', role: 'Lead Developer', email: 'm.chen@oneconnect.vn' },
  {
    id: 'm3',
    name: 'Elena Rodriguez',
    role: 'Product Manager',
    email: 'e.rodriguez@oneconnect.vn',
  },
  { id: 'm4', name: 'James Wilson', role: 'Data Scientist', email: 'j.wilson@oneconnect.vn' },
];

export const MOCK_PROJECTS = [
  { id: 'p1', name: 'E-commerce Platform Redesign', description: 'Modernizing the checkout flow.' },
  { id: 'p2', name: 'Banking Mobile App', description: 'Next-gen security for mobile banking.' },
  { id: 'p3', name: 'Logistics Optimization System', description: 'AI-driven route planning.' },
  { id: 'p4', name: 'AI Customer Service Bot', description: 'NLP based automated support.' },
];

export const MOCK_GROUPS = [
  {
    id: 'g1',
    name: 'Web Frontend A',
    track: 'FRONTEND',
    status: 'ACTIVE',
    term: 'Sem 1 - 2024',
    mentorId: 'm1',
    mentor: 'Sarah Jenkins',
    memberCount: 12,
  },
  {
    id: 'g2',
    name: 'Mobile App Dev B',
    track: 'MOBILE',
    status: 'ACTIVE',
    term: 'Sem 1 - 2024',
    mentorId: 'm2',
    mentor: 'Marcus Chen',
    memberCount: 8,
  },
];
