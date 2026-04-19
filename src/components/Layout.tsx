import type { ReactNode } from 'react';
import { useAppStore } from '../stores/appStore';

interface LayoutProps {
  children: ReactNode;
}

const NAV_TABS = [
  { id: 'catalog',      label: 'Catálogo'     },
  { id: 'deckbuilder',  label: 'Constructor'  },
  { id: 'simulator',    label: 'Simulador'    },
  { id: 'banlist',      label: 'Banlist'      },
  { id: 'asesor',       label: 'Asesor'       },
  { id: 'contacto',     label: 'Contacto'     },
] as const;

export function Layout({ children }: LayoutProps) {
  const activeTab  = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">MyL</div>
          <nav className="nav-tabs" role="tablist">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
                data-testid={`tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        Creado por <strong>patriciods_myl</strong>
      </footer>
    </div>
  );
}
