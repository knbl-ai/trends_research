export type MilitaryType = 'tactical-gear' | 'uniforms' | 'weapons-systems' | 'vehicles' | 'cyber-defense' | 'global-conflicts';

export interface MilitaryStyleConfig {
  id: MilitaryType;
  name: string;
  prompt: string;
}

export const MILITARY_PROMPTS: Record<MilitaryType, MilitaryStyleConfig> = {
  'tactical-gear': {
    id: 'tactical-gear',
    name: 'Tactical Gear',
    prompt: "Research the top 3 most current tactical gear trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in military operations, special forces equipment, and combat readiness. Key sub-elements (body armor, tactical vests, night vision, communication systems, modular gear). How and why it has emerged (technological advancements, operational requirements, soldier safety priorities). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'uniforms': {
    id: 'uniforms',
    name: 'Military Uniforms',
    prompt: "Research the top 3 most current military uniform trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in armed forces worldwide, camouflage patterns, and uniform technologies. Key sub-elements (digital camo patterns, adaptive materials, climate-specific designs, rank insignia innovations). How and why it has emerged (concealment technology, comfort requirements, multi-environment operations). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'weapons-systems': {
    id: 'weapons-systems',
    name: 'Weapons Systems',
    prompt: "Research the top 3 most current weapons systems trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in military arsenals, small arms development, and emerging technologies. Key sub-elements (precision systems, smart ammunition, modular platforms, non-lethal options, autonomous capabilities). How and why it has emerged (accuracy requirements, battlefield adaptability, technological innovation). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'vehicles': {
    id: 'vehicles',
    name: 'Military Vehicles',
    prompt: "Research the top 3 most current military vehicle trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in ground forces, air forces, and naval operations. Key sub-elements (armored vehicles, aircraft, naval vessels, unmanned systems, electric/hybrid propulsion). How and why it has emerged (mobility needs, force protection, environmental considerations, automation). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'cyber-defense': {
    id: 'cyber-defense',
    name: 'Cyber Defense',
    prompt: "Research the top 3 most current cyber defense trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in military networks, information warfare, and digital security. Key sub-elements (AI-powered defense, quantum encryption, threat detection, offensive capabilities, critical infrastructure protection). How and why it has emerged (cyber threats evolution, digital warfare prominence, national security priorities). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'global-conflicts': {
    id: 'global-conflicts',
    name: 'Global Conflicts',
    prompt: "Research the top 3 most significant global military conflict trends (2025-late) worldwide. For each trend, provide: A detailed description of what the trend is, including current military operations, geopolitical tensions, and evolving warfare strategies. Key sub-elements (conflict regions, military doctrines, alliance dynamics, hybrid warfare, proxy conflicts). How and why it has emerged (geopolitical factors, regional instability, strategic interests, power dynamics). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  }
};

export function getPromptByType(type: MilitaryType): string {
  return MILITARY_PROMPTS[type].prompt;
}

export function getAllMilitaryTypes(): MilitaryStyleConfig[] {
  return Object.values(MILITARY_PROMPTS);
}
