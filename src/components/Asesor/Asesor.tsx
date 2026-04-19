import { useState } from 'react';
import { AlternativasForm } from './AlternativasForm';
import { SinergiasForm } from './SinergiasForm';
import { GemasForm } from './GemasForm';
import { PreciosForm } from './PreciosForm';

type SubTab = 'alternativas' | 'sinergias' | 'gemas' | 'precios';

const subTabs = [
  { id: 'alternativas' as SubTab, label: 'Alternativas' },
  { id: 'sinergias' as SubTab, label: 'Sinergias' },
  { id: 'gemas' as SubTab, label: 'Gemas Ocultas' },
  { id: 'precios' as SubTab, label: 'Precios' },
];

export function Asesor() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('alternativas');

  return (
    <div className="max-w-[1400px] mx-auto px-6 space-y-6" data-testid="asesor">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 pb-6 border-b-2 border-slate-700">
        <h1 className="font-display text-2xl font-bold text-[#e94560] text-center uppercase tracking-widest mb-2">
          Asesor de MyL
        </h1>
        <p className="text-base text-slate-300 text-center max-w-[800px] mx-auto leading-[1.6]">
          Descubrí cartas alternativas, sinergias poderosas, gemas ocultas y compará precios de tu colección
        </p>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex gap-2 flex-wrap bg-slate-800 p-2 rounded-xl border-2 border-slate-700 shadow-md">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`
              flex-1 min-w-[120px] bg-transparent border-2 border-transparent text-slate-300 font-display text-base font-semibold px-6 py-3 cursor-pointer transition-all duration-[250ms] rounded-lg relative overflow-hidden
              ${activeSubTab === tab.id
                ? 'text-white bg-[#e94560] border-[#e94560] shadow-[0_0_15px_rgba(233,69,96,0.3)]'
                : 'hover:text-white hover:border-[#e94560] hover:-translate-y-0.5 hover:shadow-md'
              }
            `}
            data-testid={`asesor-tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeSubTab === 'alternativas' && <AlternativasForm />}
        {activeSubTab === 'sinergias' && <SinergiasForm />}
        {activeSubTab === 'gemas' && <GemasForm />}
        {activeSubTab === 'precios' && <PreciosForm />}
      </div>
    </div>
  );
}
