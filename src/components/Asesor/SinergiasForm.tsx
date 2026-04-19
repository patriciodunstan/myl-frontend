import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { findSynergies } from '../../api/advisor';
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

export function SinergiasForm() {
  const [cardNames, setCardNames] = useState('');
  const [format, setFormat] = useState<'racial_edicion' | 'racial_libre' | 'formato_libre'>('racial_edicion');
  const queryClient = useQueryClient();

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: findSynergies,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-synergies'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNames.trim()) return;

    const names = cardNames
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) return;

    mutate({
      card_names: names,
      format,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buscar Sinergias</CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Encuentra cartas que funcionan bien juntas
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardNames">Nombres de cartas (separados por coma)</Label>
              <Input
                id="cardNames"
                type="text"
                placeholder="Ej: Genseric, Medea, Alboin"
                value={cardNames}
                onChange={(e) => setCardNames(e.target.value)}
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

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 text-sm text-red-400">
                Error: {error.message}
              </div>
            )}

            <Button type="submit" disabled={isPending} isLoading={isPending} className="w-full">
              {isPending ? 'Buscando...' : 'Buscar Sinergias'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {data?.synergies && data.synergies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sinergias Encontradas ({data.synergies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.synergies.map((synergy, index) => (
                <div
                  key={`${synergy.cards.map((c) => c.id).join('-')}-${index}`}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-red-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="warning">{synergy.synergy_type}</Badge>
                    </div>
                    <ScoreBar score={synergy.synergy_score} className="w-32" />
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    {synergy.cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center gap-2 bg-slate-800 rounded-md p-2"
                      >
                        {card.image_path && (
                          <img
                            src={`/images${card.image_path}`}
                            alt={card.name}
                            className="w-10 h-14 object-contain rounded"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-100">{card.name}</p>
                          {card.cost !== null && (
                            <p className="text-xs text-slate-400">{card.cost} cost</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-slate-300">{synergy.explanation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
