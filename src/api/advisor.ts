import { fetchAPI } from './client';

// Types
export interface CardInfo {
  id: number;
  name: string;
  slug: string;
  cost: number | null;
  damage: number | null;
  type_name: string;
  race_name: string | null;
  rarity_name: string | null;
  ability: string | null;
  keywords: string | null;
  image_path: string | null;
}

export interface AlternativeCard {
  card: CardInfo;
  similarity: number;
  reason: string;
}

export interface AlternativesResponse {
  alternatives: AlternativeCard[];
  meta: {
    target_card_found: boolean;
    target_card: CardInfo | null;
    format: string;
  };
  llm_analysis: Record<string, unknown> | null;
}

export interface SynergyPair {
  cards: CardInfo[];
  synergy_type: string;
  synergy_score: number;
  explanation: string;
}

export interface SynergiesResponse {
  synergies: SynergyPair[];
  meta: Record<string, unknown>;
}

export interface HiddenGem {
  card: CardInfo;
  gem_score: number;
  keyword_count: number;
  keywords: string[];
  rarity_name: string | null;
  cost_efficiency: number;
  reason: string;
}

export interface HiddenGemsResponse {
  hidden_gems: HiddenGem[];
  meta: Record<string, unknown>;
}

export interface PriceInfo {
  source: string;
  price_clp: number | null;
  availability: string | null;
  url: string | null;
  updated_at: string | null;
}

export interface PriceResponse {
  card_name: string;
  prices: PriceInfo[];
  avg_price_clp: number | null;
  min_price_clp: number | null;
}

// API calls
export async function findAlternatives(params: {
  card_name: string;
  format?: string;
  max_rarity?: string;
  max_cost?: number;
}): Promise<AlternativesResponse> {
  return fetchAPI<AlternativesResponse>('/advisor/alternatives', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function findSynergies(params: {
  card_names: string[];
  format?: string;
}): Promise<SynergiesResponse> {
  return fetchAPI<SynergiesResponse>('/advisor/synergies', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function findHiddenGems(params: {
  race_slug: string;
  format?: string;
  max_cost?: number;
  min_keywords?: number;
  limit?: number;
}): Promise<HiddenGemsResponse> {
  return fetchAPI<HiddenGemsResponse>('/advisor/hidden-gems', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getCardPrices(cardName: string): Promise<PriceResponse> {
  return fetchAPI<PriceResponse>(`/advisor/prices/${encodeURIComponent(cardName)}`);
}
