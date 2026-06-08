import { Card, CardContent } from '@/components/ui/card';
import { OrdersErrorCardProps } from './orders-page-types';

export function OrdersErrorCard({ error }: OrdersErrorCardProps) {
  if (!error) return null;

  return (
    <Card className="bg-red-50 border-red-200 mb-6">
      <CardContent className="p-6">
        <p className="text-red-800">{error}</p>
      </CardContent>
    </Card>
  );
}
