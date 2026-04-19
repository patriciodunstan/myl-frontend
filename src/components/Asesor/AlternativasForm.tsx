import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { findAlternatives } from '../../api/advisor';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
  Button,
  Badge,
  Label,
} from './ui';

export function AlternativasForm() {
  const [cardName, setCardName] = useState('');
  const [format, setFormat] = useState<'racial_edicion' | 'racial_libre' | 'formato_libre'>('racial_edicion');
  const [maxCost, setMaxCost] = useState<number | ''>('');
  const queryClient = useQueryClient();

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: findAlternatives,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-alternatives'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    mutate({
      card_name: cardName.trim(),
      format,
      max_rarity: undefined,
      max_cost: maxCost === '' ? undefined : maxCost,
    });
  };

  const targetCard = data?.meta.target_card;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buscar Alternativas</CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Encuentra cartas similares a una carta específica
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardName">Nombre de la carta</Label>
              <Input
                id="cardName"
                type="text"
                placeholder="Ej: Genseric, Medea, Dragón Dorado..."
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="format">Formato</Label>
              <Select
                id="format"
                value={format}
                onChange={(e) =>
                  setFormat(
                    e.target.value as 'racial_edicion' | 'racial_libre' | 'formato_libre'
                  )
                }
              >
                <option value="racial_edicion">Racial Edición</option>
                <option value="racial_libre">Racial Libre</option>
                <option value="formato_libre">Formato Libre</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxCost">Costo máximo (opcional)</Label>
              <Input
                id="maxCost"
                type="number"
                min="0"
                placeholder="Sin límite"
                value={maxCost}
                onChange={(e) =>
                  setMaxCost(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 text-sm text-red-400">
                Error: {error.message}
              </div>
            )}

            <Button type="submit" disabled={isPending} isLoading={isPending} className="w-full">
              {isPending ? 'Buscando...' : 'Buscar Alternativas'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {targetCard && (
        <Card>
          <CardHeader>
            <CardTitle>Carta Objetivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              {targetCard.image_path && (
                <img
                  src={`/images${targetCard.image_path}`}
                  alt={targetCard.name}
                  className="w-24 h-32 object-contain rounded-md bg-slate-900"
                />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-100">{targetCard.name}</h4>
                  {targetCard.cost !== null && (
                    <Badge variant="accent" className="px-2 py-1">
                      {targetCard.cost}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-400">
                  {targetCard.race_name} • {targetCard.rarity_name}
                </p>
                {targetCard.ability && (
                  <p className="text-sm text-slate-300 line-clamp-2">{targetCard.ability}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {data?.alternatives && data.alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alternativas ({data.alternatives.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.alternatives.map((alt, index) => (
                <div
                  key={`${alt.card.id}-${index}`}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-red-500/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {alt.card.image_path && (
                      <img
                        src={`/images${alt.card.image_path}`}
                        alt={alt.card.name}
                        className="w-16 h-22 object-contain rounded bg-slate-800"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-slate-100 line-clamp-1">
                        {alt.card.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        {alt.card.cost !== null && (
                          <span className="text-xs text-slate-400">{alt.card.cost} cost</span>
                        )}
                        {alt.card.damage !== null && (
                          <span className="text-xs text-slate-400">{alt.card.damage} dmg</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <Badge variant="error" className="text-xs font-mono">
                      {Math.round(alt.similarity * 100)}% similar
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{alt.reason}</p>

                  {alt.card.ability && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {alt.card.ability}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
