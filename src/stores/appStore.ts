import { create } from 'zustand';
import type {
  Tab,
  CurrentDeck,
  CatalogFilters,
  SimulatorState,
  Card,
  DeckSummary,
} from '../types';

interface AppStore {
  // Catalog state
  activeTab: Tab;
  catalogFilters: CatalogFilters;
  perPage: number;

  // Deck builder state
  currentDeck: CurrentDeck;

  // Simulator state
  simulator: SimulatorState;

  // Actions
  setActiveTab: (tab: Tab) => void;
  setCatalogFilters: (filters: Partial<CatalogFilters>) => void;
  resetCatalogFilters: () => void;
  setPerPage: (perPage: number) => void;
  setCurrentDeck: (deck: CurrentDeck) => void;
  resetCurrentDeck: () => void;
  setSimulatorDeckId: (deckId: number | null) => void;
  setSimulatorDeck: (deck: DeckSummary | null) => void;
  setSimulatorHand: (hand: Card[], remaining: number) => void;
  resetSimulator: () => void;
}

const initialCatalogFilters: CatalogFilters = {
  search: '',
  race: '',
  type: '',
  edition: '',
  rarity: '',
  costMin: null,
  costMax: null,
  powerMin: null,
  powerMax: null,
  sort: 'name',
};

const initialCurrentDeck: CurrentDeck = {
  id: null,
  name: '',
  race: '',
  format: 'racial_edicion',
  cards: [],
};

const initialSimulatorState: SimulatorState = {
  selectedDeckId: null,
  deck: null,
  hand: [],
  deckRemaining: 0,
};

const DEFAULT_PER_PAGE = 24;
const savedPerPage = localStorage.getItem('myl-per-page');
const initialPerPage = savedPerPage ? parseInt(savedPerPage, 10) : DEFAULT_PER_PAGE;

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  activeTab: 'catalog',
  catalogFilters: { ...initialCatalogFilters },
  perPage: initialPerPage,
  currentDeck: { ...initialCurrentDeck },
  simulator: { ...initialSimulatorState },

  // Catalog actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCatalogFilters: (filters) => set((state) => ({
    catalogFilters: { ...state.catalogFilters, ...filters },
  })),
  resetCatalogFilters: () => set({ catalogFilters: { ...initialCatalogFilters } }),
  setPerPage: (perPage) => {
    localStorage.setItem('myl-per-page', String(perPage));
    set({ perPage });
  },

  // Deck builder actions
  setCurrentDeck: (deck) => set({ currentDeck: deck }),
  resetCurrentDeck: () => set({ currentDeck: { ...initialCurrentDeck } }),

  // Simulator actions
  setSimulatorDeckId: (deckId) => set((state) => ({
    simulator: {
      ...state.simulator,
      selectedDeckId: deckId,
      deck: null,
      hand: [],
      deckRemaining: 0,
    },
  })),
  setSimulatorDeck: (deck) => set((state) => ({
    simulator: {
      ...state.simulator,
      deck,
      deckRemaining: deck
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (deck.cards?.reduce((sum, c) => sum + ((c as any).quantity || 1), 0) || deck.cards_count || 0)
        : 0,
    },
  })),
  setSimulatorHand: (hand, remaining) => set((state) => ({
    simulator: {
      ...state.simulator,
      hand,
      deckRemaining: remaining,
    },
  })),
  resetSimulator: () => set((state) => ({
    simulator: {
      ...state.simulator,
      hand: [],
      deckRemaining: state.simulator.deck
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (state.simulator.deck.cards?.reduce((sum, c) => sum + ((c as any).quantity || 1), 0) || state.simulator.deck.cards_count || 0)
        : 0,
    },
  })),
}));
