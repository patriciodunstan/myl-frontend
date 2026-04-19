import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { findHiddenGems } from '../../api/advisor';
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
  ScoreBar,
} from './ui';

export function GemasForm() {
  const [raceSlug, setRaceSlug] = useState('');
  const [format, setFormat] = useState<'racial_edicion' | 'racial_libre' | 'formato_libre'>('racial_edicion');
  const [minKeywords, setMinKeywords] = useState(2);
  const [maxCost, setMaxCost] = useState<number | ''>('');
  const [limit, setLimit] = useState(10);
  const queryClient = useQueryClient();

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: findHiddenGems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-hidden-gems'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!raceSlug.trim()) return;

    mutate({
      race_slug: raceSlug.trim(),
      format,
      min_keywords: minKeywords,
      max_cost: maxCost === '' ? undefined : maxCost,
      limit,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Descubrir Gemas Ocultas</CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Encuentra cartas infravaloradas con múltiples keywords
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="raceSlug">Raza (slug)</Label>
              <Input
                id="raceSlug"
                type="text"
                placeholder="Ej: barbaro, dragon, eterno"
                value={raceSlug}
                onChange={(e) => setRaceSlug(e.target.value)}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="minKeywords">Mínimo de keywords</Label>
                <Input
                  id="minKeywords"
                  type="number"
                  min="1"
                  value={minKeywords}
                  onChange={(e) => setMinKeywords(Number(e.target.value))}
                  required
                />
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

              <div>
                <Label htmlFor="limit">Límite de resultados</Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  max="50"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 text-sm text-red-400">
                Error: {error.message}
              </div>
            )}

            <Button type="submit" disabled={isPending} isLoading={isPending} className="w-full">
              {isPending ? 'Buscando...' : 'Descubrir Gemas'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {data?.hidden_gems && data.hidden_gems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gemas Ocultas ({data.hidden_gems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.hidden_gems.map((gem, index) => (
                <div
                  key={`${gem.card.id}-${index}`}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-red-500/50 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-3">
                    {gem.card.image_path && (
                      <img
                        src={`/images${gem.card.image_path}`}
                        alt={gem.card.name}
                        className="w-20 h-28 object-contain rounded-md bg-slate-800"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-base font-semibold text-slate-100">
                          {gem.card.name}
                        </h5>
                        {gem.card.rarity_name && (
                          <Badge variant="success">{gem.card.rarity_name}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mb-2">
                        {gem.card.cost !== null && (
                          <span>{gem.card.cost} cost</span>
                        )}
                        <span>{gem.keyword_count} keywords</span>
                        {gem.card.damage !== null && (
                          <span>{gem.card.damage} dmg</span>
                        )}
                      </div>
                      <ScoreBar score={gem.gem_score} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {gem.keywords.map((keyword, i) => (
                      <Badge key={i} variant="accent">
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-slate-300 mb-2">{gem.reason}</p>

                  <div className="text-xs text-slate-500">
                    Eficiencia de costo: {gem.cost_efficiency.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
