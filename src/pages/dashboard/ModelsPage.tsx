import { useState } from 'react';
import { Search, Filter, Settings2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusIndicator } from '@/components/dashboard/StatusIndicator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { useDebounce } from '@/hooks/use-debounce';

const mockModels = [
  { id: '1', slug: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', inputPrice: 2.00, outputPrice: 8.00, context: 128000, isActive: true, health: 'healthy' },
  { id: '2', slug: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', inputPrice: 15.00, outputPrice: 75.00, context: 200000, isActive: true, health: 'healthy' },
  { id: '3', slug: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', inputPrice: 3.00, outputPrice: 15.00, context: 200000, isActive: true, health: 'healthy' },
  { id: '4', slug: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', inputPrice: 1.25, outputPrice: 5.00, context: 1000000, isActive: true, health: 'degraded' },
  { id: '5', slug: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta', inputPrice: 0.90, outputPrice: 0.90, context: 8192, isActive: true, health: 'healthy' },
  { id: '6', slug: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', inputPrice: 4.00, outputPrice: 12.00, context: 32000, isActive: false, health: 'maintenance' },
  { id: '7', slug: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', inputPrice: 0.50, outputPrice: 1.50, context: 16385, isActive: true, health: 'healthy' },
  { id: '8', slug: 'mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'Mistral', inputPrice: 0.60, outputPrice: 0.60, context: 32000, isActive: true, health: 'healthy' },
];

export function ModelsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filteredModels = mockModels.filter(
    (model) =>
      model.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      model.provider.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Model Management"
        description="View and manage available AI models"
        action={
          <Button variant="outline">
            <Settings2 className="h-4 w-4 mr-2" />
            Configure
          </Button>
        }
      />

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models by name or provider..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Models Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className="text-right">Input ($/1M)</TableHead>
              <TableHead className="text-right">Output ($/1M)</TableHead>
              <TableHead className="text-right">Context</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>{model.provider}</TableCell>
                <TableCell className="text-right">{formatCurrency(model.inputPrice * 100)}</TableCell>
                <TableCell className="text-right">{formatCurrency(model.outputPrice * 100)}</TableCell>
                <TableCell className="text-right">{formatNumber(model.context)}</TableCell>
                <TableCell>
                  <StatusIndicator status={model.health} />
                </TableCell>
                <TableCell>
                  <Badge variant={model.isActive ? 'success' : 'warning'}>
                    {model.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
