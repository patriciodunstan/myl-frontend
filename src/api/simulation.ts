import { fetchAPI } from './client';
import type { SimulationResponse } from '../types';

export async function simulateDraw(deckId: number): Promise<SimulationResponse> {
  return fetchAPI<SimulationResponse>('/simular', {
    method: 'POST',
    body: JSON.stringify({ deck_id: deckId }),
  });
}
