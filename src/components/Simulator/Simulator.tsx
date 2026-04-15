import { useEffect } from 'react';
import { useDecks, useDeck } from '../../hooks/useDecks';
import { useSimulation } from '../../hooks/useSimulation';
import { useAppStore } from '../../stores/appStore';
import { CardImage } from '../CardImage';
import { ManaCurve } from './ManaCurve';

export function Simulator() {
  const { data: decksData } = useDecks();
  const simulationMutation = useSimulation();
  
  const simulator = useAppStore((state) => state.simulator);
  const setSimulatorDeckId = useAppStore((state) => state.setSimulatorDeckId);
  const setSimulatorDeck = useAppStore((state) => state.setSimulatorDeck);
  const setSimulatorHand = useAppStore((state) => state.setSimulatorHand);
  const resetSimulatorState = useAppStore((state) => state.resetSimulator);

  const decks = decksData?.decks || [];

  // Fetch full deck data when a deck is selected
  const { data: fullDeck } = useDeck(simulator.selectedDeckId, simulator.selectedDeckId !== null);

  // Sync full deck data to store when it loads
  const deckCards = fullDeck?.cards || [];

  const handleDeckSelect = (deckId: string) => {
    if (!deckId) {
      setSimulatorDeckId(null);
      return;
    }
    const id = parseInt(deckId);
    setSimulatorDeckId(id);
  };

  // Sync full deck data to store when it loads (in useEffect to avoid setState-during-render)
  useEffect(() => {
    if (fullDeck && simulator.selectedDeckId && (!simulator.deck || simulator.deck.id !== fullDeck.id)) {
      setSimulatorDeck({
        id: fullDeck.id,
        name: fullDeck.name,
        race: fullDeck.race,
        format: fullDeck.format,
        created_at: fullDeck.created_at,
        updated_at: fullDeck.updated_at,
        cards: fullDeck.cards as any[],
        cards_count: fullDeck.cards?.length || 0,
      });
    }
  }, [fullDeck, simulator.selectedDeckId, simulator.deck, setSimulatorDeck]);

  const handleDrawInitialHand = async () => {
    if (!simulator.selectedDeckId) {
      alert('Selecciona un mazo primero');
      return;
    }

    try {
      const result = await simulationMutation.mutateAsync({
        deck_id: simulator.selectedDeckId,
      });
      setSimulatorHand(result.hand || [], result.remaining || 0);
    } catch (error) {
      alert('Error al simular el robo');
    }
  };

  const handleDrawOneCard = async () => {
    if (!simulator.selectedDeckId) {
      return;
    }

    if (simulator.deckRemaining <= 0) {
      alert('No quedan cartas en el mazo');
      return;
    }

    try {
      const result = await simulationMutation.mutateAsync({
        deck_id: simulator.selectedDeckId,
      });
      setSimulatorHand(
        [...simulator.hand, ...(result.hand || [])],
        result.remaining || simulator.deckRemaining - 1
      );
    } catch (error) {
      alert('Error al simular el robo');
    }
  };

  const handleReset = () => {
    resetSimulatorState();
  };

  const calculateProbabilities = () => {
    const cards = simulator.deck?.cards || deckCards;
    if (!cards || cards.length === 0) {
      return { specific: 0, lowCost: 0, midCost: 0, highCost: 0 };
    }

    const totalCards = cards.reduce((sum: number, c: any) => sum + (c.quantity || 1), 0);
    const handSize = 7;

    // Calculate probabilities using hypergeometric distribution
    const getProbability = (matchingCount: number): number => {
      if (matchingCount === 0 || totalCards === 0) return 0;

      const k = matchingCount;
      const N = totalCards;
      const n = handSize;

      // P(at least 1) = 1 - P(0)
      let p0 = 1;
      for (let i = 0; i < n; i++) {
        p0 = p0 * ((N - k - i) / (N - i));
      }

      return Math.round((1 - p0) * 100);
    };

    // Count cards by cost
    const lowCostCount = cards.filter((c: any) => (c.cost ?? 0) >= 0 && (c.cost ?? 0) <= 2).length;
    const midCostCount = cards.filter((c: any) => (c.cost ?? 0) >= 3 && (c.cost ?? 0) <= 4).length;
    const highCostCount = cards.filter((c: any) => (c.cost ?? 0) >= 5).length;

    return {
      specific: getProbability(1), // Any specific card
      lowCost: getProbability(lowCostCount),
      midCost: getProbability(midCostCount),
      highCost: getProbability(highCostCount),
    };
  };

  const probabilities = calculateProbabilities();
  const manaCurveCards = simulator.deck?.cards || deckCards || [];

  if (!simulator.selectedDeckId) {
    return (
      <div className="simulator-container" data-testid="simulator">
        <div className="simulator-controls">
          <div style={{ flex: 1, minWidth: '300px' }}>
            <label className="filter-label">Mazo</label>
            <select
              className="filter-select"
              data-testid="simulator-deck-select"
              onChange={(e) => handleDeckSelect(e.target.value)}
            >
              <option value="">Seleccionar mazo...</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>{deck.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" data-testid="simulate-button" onClick={handleDrawInitialHand}>Robar 7</button>
            <button className="btn btn-secondary" data-testid="draw-one-button" onClick={handleDrawOneCard}>+1</button>
            <button className="btn btn-secondary" data-testid="reset-simulator-button" onClick={handleReset}>Reiniciar</button>
          </div>
        </div>

        <div id="simulator-empty" className="empty-state">
          <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <h3 className="empty-state-title">Selecciona un mazo</h3>
          <p className="empty-state-message">Elige un mazo guardado para comenzar la simulación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simulator-container" data-testid="simulator">
      <div className="simulator-controls">
        <div style={{ flex: 1, minWidth: '300px' }}>
          <label className="filter-label">Mazo</label>
          <select
            className="filter-select"
            data-testid="simulator-deck-select"
            value={simulator.selectedDeckId ?? ''}
            onChange={(e) => handleDeckSelect(e.target.value)}
          >
            <option value="">Seleccionar mazo...</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>{deck.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleDrawInitialHand}>Robar 7</button>
          <button className="btn btn-secondary" onClick={handleDrawOneCard}>+1</button>
          <button className="btn btn-secondary" onClick={handleReset}>Reiniciar</button>
        </div>
      </div>

      <div className="simulator-display" style={{ display: 'grid' }}>
        <div className="hand-display" data-testid="hand-area">
          <div className="hand-header">
            <h3 className="hand-title">Mano Inicial</h3>
            <span className="hand-info">Mazo: <span id="deck-remaining">{simulator.deckRemaining}</span> cartas restantes</span>
          </div>
          <div id="hand-cards" className="hand-cards" data-testid="hand-cards">
            {simulator.hand.map((card, index) => (
              <div
                key={index}
                className="hand-card"
                data-testid="hand-card"
                style={{ width: '120px', height: '168px' }}
              >
                <CardImage
                  editionId={card.edition_id}
                  edid={card.edid}
                  alt={card.name}
                  className="hand-card-image"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="statistics-panel">
          <h4 className="statistics-title">Estadísticas</h4>
          <div id="simulator-stats">
            <div className="stat-item">
              <span className="stat-label">Probabilidad de carta específica</span>
              <span className="stat-value" id="specific-card-prob">{probabilities.specific}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Probabilidad de 1+ carta coste 0-2</span>
              <span className="stat-value" id="low-cost-prob">{probabilities.lowCost}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Probabilidad de 1+ carta coste 3-4</span>
              <span className="stat-value" id="mid-cost-prob">{probabilities.midCost}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Probabilidad de 1+ carta coste 5+</span>
              <span className="stat-value" id="high-cost-prob">{probabilities.highCost}%</span>
            </div>
          </div>
          {manaCurveCards.length > 0 && <ManaCurve cards={manaCurveCards} />}
        </div>
      </div>
    </div>
  );
}
