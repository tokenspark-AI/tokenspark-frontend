import { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/dashboard/StatusIndicator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatTokens, formatDate, formatDuration } from '@/lib/formatters';
import { useDebounce } from '@/hooks/use-debounce';

const mockLogs = [
  { id: 'LOG-001', timestamp: '2026-04-22 10:30:22', user: 'Alice', model: 'GPT-4.1', promptTokens: 150, completionTokens: 890, cost: 0.031, provider: 'openai', status: 'completed', latencyMs: 1240 },
  { id: 'LOG-002', timestamp: '2026-04-22 10:29:45', user: 'Bob', model: 'Claude 3 Opus', promptTokens: 320, completionTokens: 1200, cost: 0.098, provider: 'anthropic', status: 'completed', latencyMs: 2100 },
  { id: 'LOG-003', timestamp: '2026-04-22 10:28:12', user: 'Charlie', model: 'Code Assistant', promptTokens: 0, completionTokens: 0, cost: 0.12, provider: 'agentspark', status: 'completed', latencyMs: 3500 },
  { id: 'LOG-004', timestamp: '2026-04-22 10:27:33', user: 'Diana', model: 'Gemini Pro', promptTokens: 80, completionTokens: 450, cost: 0.025, provider: 'google', status: 'failed', latencyMs: 800 },
  { id: 'LOG-005', timestamp: '2026-04-22 10:26:18', user: 'Eve', model: 'Llama 3 70B', promptTokens: 200, completionTokens: 680, cost: 0.008, provider: 'meta', status: 'completed', latencyMs: 950 },
  { id: 'LOG-006', timestamp: '2026-04-22 10:25:44', user: 'Frank', model: 'Data Analyst', promptTokens: 0, completionTokens: 0, cost: 0.15, provider: 'agentspark', status: 'completed', latencyMs: 4200 },
  { id: 'LOG-007', timestamp: '2026-04-22 10:24:56', user: 'Grace', model: 'GPT-3.5 Turbo', promptTokens: 95, completionTokens: 320, cost: 0.005, provider: 'openai', status: 'completed', latencyMs: 620 },
  { id: 'LOG-008', timestamp: '2026-04-22 10:23:12', user: 'Henry', model: 'Mistral Large', promptTokens: 180, completionTokens: 540, cost: 0.028, provider: 'mistral', status: 'timeout', latencyMs: 30000 },
];

export function LogsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filteredLogs = mockLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      log.model.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      log.provider.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Call Logs"
        description="Real-time log of all API and agent calls"
        action={
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, model, or provider..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Logs Table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Model/Agent</TableHead>
              <TableHead className="text-right">Prompt</TableHead>
              <TableHead className="text-right">Completion</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {formatDate(log.timestamp)}
                </TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="font-medium">{log.model}</TableCell>
                <TableCell className="text-right">{log.promptTokens > 0 ? formatTokens(log.promptTokens) : '-'}</TableCell>
                <TableCell className="text-right">{log.completionTokens > 0 ? formatTokens(log.completionTokens) : '-'}</TableCell>
                <TableCell className="text-right">{formatCurrency(log.cost * 100)}</TableCell>
                <TableCell className="capitalize">{log.provider}</TableCell>
                <TableCell>{formatDuration(log.latencyMs)}</TableCell>
                <TableCell>
                  <StatusIndicator status={log.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
