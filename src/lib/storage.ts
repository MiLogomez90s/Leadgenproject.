import { Lead, SalesRep, AggregatorTask } from '../types';

const STORAGE_KEY = 'leadpulse_leads';
const SALES_KEY = 'leadpulse_sales_reps';
const TASKS_KEY = 'leadpulse_aggregator_tasks';

const SAMPLE_TASKS: AggregatorTask[] = [
  { 
    id: 'task-1', 
    name: 'Miami HVAC Outreach', 
    niche: 'HVAC', 
    industry: 'Construction', 
    country: 'US', 
    city: 'Miami', 
    frequency: 'daily', 
    lastRun: new Date().toISOString(),
    active: true 
  },
  { 
    id: 'task-2', 
    name: 'CDMX Solar Lead Gen', 
    niche: 'Solar Panels', 
    industry: 'Energy', 
    country: 'LATAM', 
    city: 'Mexico City', 
    frequency: 'weekly', 
    lastRun: null,
    active: false 
  }
];

const SAMPLE_SALES_REPS: SalesRep[] = [
  { id: 'sr-1', name: 'Alex Miller', email: 'alex@leadpulse.ai', assignedLeads: [] },
  { id: 'sr-2', name: 'Jordan Case', email: 'jordan@leadpulse.ai', assignedLeads: [] },
  { id: 'sr-3', name: 'Sam Rivera', email: 'sam@leadpulse.ai', assignedLeads: [] }
];

const SAMPLE_LEADS: Lead[] = [
  {
    id: 'sample-1',
    name: 'Michael',
    company: 'Skyline Roofing',
    industry: 'Roofing Contractor',
    email: 'info@skylineroof.com',
    phone: '(555) 123-4567',
    website: 'https://example.com',
    address: '123 Main St, New York, NY',
    location: { lat: 40.7128, lng: -74.0060 },
    rating: 4.8,
    userRatingsTotal: 120,
    ownerTitle: 'CEO',
    reliabilityScore: 95,
    conversionScore: 82,
    score: 85,
    priority: 'high',
    status: 'new',
    assignedTo: null,
    assignedToDispatcher: true,
    createdAt: new Date().toISOString(),
    notes: 'High volume business, good ratings.',
    source: 'manual'
  },
  {
    id: 'sample-2',
    name: 'Sarah',
    company: 'Green Leaf Cafe',
    industry: 'Restaurant',
    email: 'contact@greenleaf.com',
    phone: '(555) 987-6543',
    website: null,
    address: '456 Oak Ave, Brooklyn, NY',
    location: { lat: 40.6782, lng: -73.9442 },
    rating: 4.2,
    userRatingsTotal: 340,
    ownerTitle: 'Manager',
    reliabilityScore: 78,
    conversionScore: 45,
    score: 45,
    priority: 'medium',
    status: 'interested',
    assignedTo: 'sr-1',
    assignedToDispatcher: false,
    createdAt: new Date().toISOString(),
    notes: 'Potential for recurring maintenance.',
    source: 'manual'
  }
];

export const storage = {
  getLeads: (): Lead[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return SAMPLE_LEADS;
    return JSON.parse(data);
  },
  saveLeads: (leads: Lead[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  },
  addLead: (lead: Lead) => {
    const leads = storage.getLeads();
    // Check if already exists
    if (!leads.find(l => l.id === lead.id)) {
      storage.saveLeads([...leads, lead]);
    }
  },
  updateLead: (lead: Lead) => {
    const leads = storage.getLeads();
    const index = leads.findIndex(l => l.id === lead.id);
    if (index !== -1) {
      leads[index] = lead;
      storage.saveLeads(leads);
    }
  },
  deleteLead: (id: string) => {
    const leads = storage.getLeads();
    storage.saveLeads(leads.filter(l => l.id !== id));
  },
  getSalesReps: (): SalesRep[] => {
    const data = localStorage.getItem(SALES_KEY);
    if (!data) return SAMPLE_SALES_REPS;
    return JSON.parse(data);
  },
  saveSalesReps: (reps: SalesRep[]) => {
    localStorage.setItem(SALES_KEY, JSON.stringify(reps));
  },
  distributeLeads: (leadIds: string[]) => {
    const leads = storage.getLeads();
    const reps = storage.getSalesReps();
    const targetLeads = leads.filter(l => leadIds.includes(l.id) && !l.assignedToDispatcher && !l.assignedTo);
    
    if (targetLeads.length === 0 || reps.length === 0) return;

    targetLeads.forEach(lead => {
      const randomRepIndex = Math.floor(Math.random() * reps.length);
      const rep = reps[randomRepIndex];
      
      lead.assignedTo = rep.id;
      if (!rep.assignedLeads.includes(lead.id)) {
        rep.assignedLeads.push(lead.id);
      }
    });

    storage.saveLeads(leads);
    storage.saveSalesReps(reps);
  },
  getTasks: (): AggregatorTask[] => {
    const data = localStorage.getItem(TASKS_KEY);
    if (!data) return SAMPLE_TASKS;
    return JSON.parse(data);
  },
  saveTasks: (tasks: AggregatorTask[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },
  autoApproveAndAssign: (newLead: Lead) => {
    // Automatic Rejection Logic: Must have at least email or phone to be valid
    const hasContactInfo = !!(newLead.email || newLead.phone);
    if (!hasContactInfo) {
      newLead.status = 'rejected';
      newLead.notes = `Auto-rejected: Missing contact information. ${newLead.notes || ''}`;
      storage.addLead(newLead);
      return;
    }

    // Set scores if not present
    if (!newLead.reliabilityScore) newLead.reliabilityScore = Math.floor(Math.random() * 40) + 60;
    if (!newLead.conversionScore) newLead.conversionScore = Math.floor(Math.random() * 40) + 50;
    if (!newLead.ownerTitle) newLead.ownerTitle = 'Business Owner';

    // 60% top leads to Dispatcher, 40% to sales
    const isTopLead = (newLead.conversionScore + newLead.reliabilityScore) / 2 > 80;
    
    // Logic: 60% of all leads go to dispatcher regardless of score? 
    // User said: "best leads will be assigned to dispatcher and 60% of leads produced will be for it"
    // We'll use a probability if not strictly "best"
    const roll = Math.random();
    if (roll < 0.6 || isTopLead) {
      newLead.assignedToDispatcher = true;
    } else {
      newLead.assignedToDispatcher = false;
      // Assign to a random sales rep immediately
      const reps = storage.getSalesReps();
      if (reps.length > 0) {
        const randomRepIndex = Math.floor(Math.random() * reps.length);
        const rep = reps[randomRepIndex];
        newLead.assignedTo = rep.id;
        rep.assignedLeads.push(newLead.id);
        storage.saveSalesReps(reps);
      }
    }
    
    newLead.score = Math.floor((newLead.reliabilityScore + newLead.conversionScore) / 2);
    storage.addLead(newLead);
  }
};
