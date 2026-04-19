import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCardPrices } from '../../api/advisor';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
  Badge,
  Label,
} from './ui';

export function PreciosForm() {
  const [cardName, setCardName] = useState('');
  const queryClient = useQueryClient();

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: getCardPrices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-prices'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    mutate(cardName.trim());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consultar Precios</CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Compara precios de una carta en diferentes tiendas
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

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 text-sm text-red-400">
                Error: {error.message}
              </div>
            )}

            <Button type="submit" disabled={isPending} isLoading={isPending} className="w-full">
              {isPending ? 'Buscando...' : 'Consultar Precios'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Precios: {data.card_name}</CardTitle>
            {data.avg_price_clp !== null && data.min_price_clp !== null && (
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Promedio</Badge>
                  <span className="text-sm font-mono text-slate-100">
                    ${data.avg_price_clp.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Mínimo</Badge>
                  <span className="text-sm font-mono text-slate-100">
                    ${data.min_price_clp.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {data.prices.length > 0 ? (
              <div className="space-y-3">
                {data.prices.map((price, index) => (
                  <div
                    key={`${price.source}-${index}`}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-red-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-slate-100 mb-2">
                          {price.source}
                        </h5>
                        {price.availability && (
                          <Badge variant="accent" className="mb-2 inline-block">
                            {price.availability}
                          </Badge>
                        )}
                        {price.price_clp !== null && (
                          <p className="text-lg font-mono text-red-400">
                            ${price.price_clp.toLocaleString('es-CL')}
                          </p>
                        )}
                        {price.updated_at && (
                          <p className="text-xs text-slate-500 mt-1">
                            Actualizado: {new Date(price.updated_at).toLocaleDateString('es-CL')}
                          </p>
                        )}
                      </div>
                      {price.url && (
                        <a
                          href={price.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md font-medium transition-colors"
                        >
                          Ver en tienda
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                No hay precios disponibles para esta carta
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
