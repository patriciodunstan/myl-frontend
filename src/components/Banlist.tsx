import { useState } from 'react';
import { useBanlist } from '../hooks/useBanlist';
import type { FormatOption } from '../types';

export function Banlist() {
  const [format, setFormat] = useState<FormatOption>('racial_edicion');
  const { data: banlistData, isLoading } = useBanlist(format);

  const banlist = banlistData?.banlist || [];

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value as FormatOption);
  };

  const getStatusClass = (restriction: string): string => {
    if (restriction === 'prohibida') return 'prohibited';
    if (restriction === 'limitada_1' || restriction === 'limitada_2') return 'limited';
    return 'unrestricted';
  };

  const getStatusText = (restriction: string): string => {
    if (restriction === 'prohibida') return 'Prohibida';
    if (restriction === 'limitada_1' || restriction === 'limitada_2') return 'Limitada';
    if (restriction === 'sin_restriccion') return 'Desrestringida';
    return 'Sin restricción';
  };

  const getLimitText = (restriction: string): string => {
    if (restriction === 'prohibida') return '0';
    if (restriction === 'limitada_1') return '1';
    if (restriction === 'limitada_2') return '2';
    if (restriction === 'sin_restriccion') return '3';
    return '-';
  };

  return (
    <div className="banlist-container" data-testid="banlist">
      <div className="banlist-header">
        <h2 className="banlist-title">Lista de Prohibidos</h2>
        <select
          className="filter-select"
          data-testid="banlist-format-select"
          value={format}
          onChange={handleFormatChange}
        >
          <option value="racial_edicion">Racial Edición</option>
          <option value="racial_libre">Racial Libre</option>
          <option value="formato_libre">Formato Libre</option>
        </select>
      </div>

      {isLoading ? (
        <div className="loading-state" style={{ display: 'flex' }}>
          <div className="spinner"></div>
          <p className="loading-text">Cargando banlist...</p>
        </div>
      ) : (
        <table className="banlist-table" id="banlist-table" data-testid="banlist-table">
          <thead>
            <tr>
              <th>Carta</th>
              <th>Edición</th>
              <th>Estado</th>
              <th>Límite</th>
            </tr>
          </thead>
          <tbody id="banlist-tbody" data-testid="banlist-list">
            {banlist.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No hay cartas prohibidas para este formato
                </td>
              </tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              banlist.map((entry: any, index: number) => (
                <tr key={index} data-testid="banlist-item">
                  <td>{entry.card_name}</td>
                  <td>{entry.edition || '-'}</td>
                  <td>
                    <span className={`banlist-status ${getStatusClass(entry.restriction)}`} data-testid="banlist-restriction">
                      {getStatusText(entry.restriction)}
                    </span>
                  </td>
                  <td>{getLimitText(entry.restriction)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div id="banlist-updated" className="banlist-updated">
        Última actualización: {new Date().toLocaleDateString('es-CL')}
      </div>
    </div>
  );
}
