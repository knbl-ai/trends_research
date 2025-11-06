export type MilitaryType = 'air-sea-land' | 'counterterrorism-intelligence' | 'operational-innovation' | 'drones' | 'employer-branding';

export interface MilitaryStyleConfig {
  id: MilitaryType;
  name: string;
  prompt: string;
}

export const MILITARY_PROMPTS: Record<MilitaryType, MilitaryStyleConfig> = {
  'air-sea-land': {
    id: 'air-sea-land',
    name: 'Air, Sea, and Land',
    prompt: "Research the top 3 most current multi-domain military operations trends (2025-late) globally across air, sea, and land forces. For each trend, provide: A detailed description of what the trend is, including how it's showing up in naval operations, air superiority missions, ground force deployments, and joint operations. Key sub-elements (naval fleet modernization, fighter aircraft capabilities, amphibious operations, cross-domain coordination, integrated command systems). How and why it has emerged (multi-domain warfare requirements, strategic mobility needs, joint force integration, technological convergence). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'counterterrorism-intelligence': {
    id: 'counterterrorism-intelligence',
    name: 'Counter-terrorism and Intelligence',
    prompt: "Research the top 3 most current counter-terrorism and intelligence trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in special operations, intelligence gathering, surveillance systems, and security operations. Key sub-elements (intelligence fusion centers, biometric identification, signals intelligence, human intelligence, counter-insurgency tactics, threat assessment technologies). How and why it has emerged (evolving terrorist threats, intelligence sharing needs, advanced surveillance capabilities, national security priorities). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'operational-innovation': {
    id: 'operational-innovation',
    name: 'Operational Innovation & High-Tech',
    prompt: "Research the top 3 most current operational innovation and high-tech military trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in military operations, emerging technologies, and next-generation warfare systems. Key sub-elements (artificial intelligence integration, quantum computing applications, directed energy weapons, hypersonic systems, autonomous platforms, augmented reality for operations, advanced materials). How and why it has emerged (technological breakthroughs, competitive advantages, operational efficiency demands, future warfare preparation). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'drones': {
    id: 'drones',
    name: 'Drones',
    prompt: "Research the top 3 most current drone and unmanned systems trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in military operations, UAV/UAS deployments, and autonomous aerial systems. Key sub-elements (combat drones, reconnaissance UAVs, drone swarms, counter-drone systems, autonomous navigation, payload capabilities, long-endurance platforms). How and why it has emerged (unmanned warfare advantages, surveillance requirements, precision strike capabilities, reduced personnel risk, cost-effectiveness). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'employer-branding': {
    id: 'employer-branding',
    name: 'Employer Branding in Global Defense Companies',
    prompt: "Research the top 3 most current employer branding trends (2025-late) in global defense companies and military contractors. For each trend, provide: A detailed description of what the trend is, including how it's showing up in recruitment strategies, talent acquisition, corporate culture initiatives, and defense industry marketing. Key sub-elements (veteran recruitment programs, STEM talent attraction, diversity initiatives, innovation culture promotion, competitive benefits, career development pathways, corporate social responsibility). How and why it has emerged (talent competition, workforce demographics shifts, skills shortages, generational expectations, industry image transformation). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  }
};

export function getPromptByType(type: MilitaryType): string {
  return MILITARY_PROMPTS[type].prompt;
}

export function getAllMilitaryTypes(): MilitaryStyleConfig[] {
  return Object.values(MILITARY_PROMPTS);
}
