import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Save, Calculator } from 'lucide-react';

interface ModelPricing {
  id: string;
  model: string;
  basePrice: number;
  partnerMarkup: number;
  finalPrice: number;
  margin: number;
}

const mockPricing: ModelPricing[] = [
  { id: '1', model: 'gpt-4o', basePrice: 2.50, partnerMarkup: 20, finalPrice: 3.00, margin: 0.50 },
  { id: '2', model: 'claude-3-opus', basePrice: 15.00, partnerMarkup: 15, finalPrice: 17.25, margin: 2.25 },
  { id: '3', model: 'deepseek-v3', basePrice: 0.27, partnerMarkup: 30, finalPrice: 0.35, margin: 0.08 },
  { id: '4', model: 'gemini-1.5-pro', basePrice: 3.50, partnerMarkup: 25, finalPrice: 4.38, margin: 0.88 },
];

export function PricingPage() {
  const [pricing] = useState(mockPricing);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricing Management"
        description="Set custom pricing for your customers"
        action={
          <Button variant="spark">
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        }
      />

      <ChartCard title="Model Pricing" description="Markup configuration per model">
        <div className="space-y-4">
          {pricing.map((item) => (
            <div key={item.id} className="p-4 bg-secondary/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="info">{item.model}</Badge>
                  <span className="text-sm text-muted-foreground">Base: ${item.basePrice.toFixed(2)}/M tokens</span>
                </div>
                <Badge variant="default">Margin: +{item.margin.toFixed(2)}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Your Markup (%)</label>
                  <Input type="number" defaultValue={item.partnerMarkup} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Final Price</label>
                  <div className="text-lg font-bold">${item.finalPrice.toFixed(2)}</div>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline">
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Profit Calculator" description="Estimate your profit based on volume">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <label className="text-sm text-muted-foreground mb-2 block">Monthly API Calls (millions)</label>
            <Input type="number" defaultValue={100} />
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <label className="text-sm text-muted-foreground mb-2 block">Average Markup (%)</label>
            <Input type="number" defaultValue={20} />
          </div>
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-sm text-muted-foreground mb-2">Estimated Monthly Profit</div>
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              $500.00
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
