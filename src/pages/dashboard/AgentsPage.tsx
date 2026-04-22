import { useState } from 'react';
import { Search, Filter, Plus, Star } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import { formatCurrency, formatDuration, formatSuccessRate, formatNumber } from '@/lib/formatters';

const mockAgents = [
  {
    id: '1',
    name: 'Code Assistant Pro',
    description: 'Write, review, and debug code with AI-powered suggestions',
    category: 'Development',
    price: 0.05,
    priceUnit: 'task' as const,
    successRate: 0.98,
    latencyMs: 1200,
    executions: 8920,
    rating: 4.8,
    isActive: true,
  },
  {
    id: '2',
    name: 'Data Analyst',
    description: 'Analyze datasets, create visualizations, generate insights',
    category: 'Analytics',
    price: 0.08,
    priceUnit: 'task' as const,
    successRate: 0.95,
    latencyMs: 2100,
    executions: 6540,
    rating: 4.6,
    isActive: true,
  },
  {
    id: '3',
    name: 'Research Agent',
    description: 'Deep research across domains with cited sources',
    category: 'Research',
    price: 0.12,
    priceUnit: 'task' as const,
    successRate: 0.92,
    latencyMs: 3500,
    executions: 4210,
    rating: 4.5,
    isActive: true,
  },
  {
    id: '4',
    name: 'Translation Master',
    description: 'High-quality translation across 50+ languages',
    category: 'Language',
    price: 0.02,
    priceUnit: 'task' as const,
    successRate: 0.99,
    latencyMs: 800,
    executions: 3180,
    rating: 4.9,
    isActive: true,
  },
  {
    id: '5',
    name: 'SEO Optimizer',
    description: 'Optimize content for search engines and improve rankings',
    category: 'Marketing',
    price: 0.04,
    priceUnit: 'task' as const,
    successRate: 0.94,
    latencyMs: 1500,
    executions: 2890,
    rating: 4.4,
    isActive: true,
  },
  {
    id: '6',
    name: 'Customer Support',
    description: 'AI-powered customer service with context awareness',
    category: 'Support',
    price: 0.03,
    priceUnit: 'task' as const,
    successRate: 0.96,
    latencyMs: 600,
    executions: 12400,
    rating: 4.7,
    isActive: true,
  },
];

export function AgentsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filteredAgents = mockAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      agent.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      agent.category.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Marketplace"
        description="Discover and use AI agents for various tasks"
        action={
          <Button variant="spark">
            <Plus className="h-4 w-4 mr-2" />
            Create Agent
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
            placeholder="Search agents by name, description, or category..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="cursor-pointer hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{agent.name}</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {agent.description}
              </p>
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">{agent.rating}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({formatNumber(agent.executions)} executions)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Price</p>
                  <p className="font-medium">{formatCurrency(agent.price * 100)}/{agent.priceUnit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Latency</p>
                  <p className="font-medium">{formatDuration(agent.latencyMs)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Success</p>
                  <p className="font-medium">{formatSuccessRate(agent.successRate)}</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="info">{agent.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
