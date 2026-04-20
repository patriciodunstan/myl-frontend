import { useState } from 'react';
import { useCards } from './hooks/useCards';
import { useAppStore } from './stores/appStore';
import { Layout } from './components/Layout';
import { FiltersSidebar } from './components/Catalog/FiltersSidebar';
import { CardGrid } from './components/Catalog/CardGrid';
import { DeckBuilder } from './components/DeckBuilder/DeckBuilder';
import { Simulator } from './components/Simulator/Simulator';
import { Banlist } from './components/Banlist';
import { Contact } from './components/Contact';

function App() {
  const activeTab = useAppStore((state) => state.activeTab);
  const catalogFilters = useAppStore((state) => state.catalogFilters);
  const setCatalogFilters  = useAppStore((state) => state.setCatalogFilters);
  const resetCatalogFilters = useAppStore((state) => state.resetCatalogFilters);
  const perPage = useAppStore((state) => state.perPage);
  const setPerPage = useAppStore((state) => state.setPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const { data: cardsData } = useCards({
    ...catalogFilters,
    page: currentPage,
    per_page: perPage,
  });

  const cards = cardsData?.cards || [];
  const totalPages = cardsData?.total_pages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleFiltersChange = (filters: Partial<typeof catalogFilters>) => {
    setCatalogFilters(filters);
    setCurrentPage(1);
  };

  const handleFiltersReset = () => {
    resetCatalogFilters();
    setCurrentPage(1);
  };

  return (
    <Layout>
      {activeTab === 'catalog' && (
        <div className="catalog-container">
          <FiltersSidebar
            filters={catalogFilters}
            onFiltersChange={handleFiltersChange}
            onReset={handleFiltersReset}
          />
          <CardGrid
            cards={cards}
            currentPage={currentPage}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </div>
      )}
      {activeTab === 'deckbuilder' && <DeckBuilder />}
      {activeTab === 'simulator' && <Simulator />}
      {activeTab === 'banlist' && <Banlist />}
      {activeTab === 'contacto' && <Contact />}
    </Layout>
  );
}

export default App;
