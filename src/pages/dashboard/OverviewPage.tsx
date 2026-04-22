import { DollarSign, Cpu, Bot, Zap } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatTokens, formatNumber } from '@/lib/formatters';

// Mock data
const requestTrendData = [
  { date: '04-16', requests: 12500, cost: 45 },
  { date: '04-17', requests: 15200, cost: 52 },
  { date: '04-18', requests: 18900, cost: 61 },
  { date: '04-19', requests: 16400, cost: 55 },
  { date: '04-20', requests: 22100, cost: 72 },
  { date: '04-21', requests: 24800, cost: 80 },
  { date: '04-22', requests: 28500, cost: 92 },
];

const costStructureData = [
  { name: 'System Revenue', value: 30, color: '#3b82f6' },
  { name: 'Provider Payout', value: 55, color: '#8b5cf6' },
  { name: 'Partner Commission', value: 10, color: '#f59e0b' },
  { name: 'Reserve', value: 5, color: '#10b981' },
];

const topModelsData = [
  { id: '1', slug: 'gpt-4.1', name: 'GPT-4.1', requests: 45200, cost: 1250 },
  { id: '2', slug: 'claude-3-opus', name: 'Claude 3 Opus', requests: 32100, cost: 980 },
  { id: '3', slug: 'gemini-pro', name: 'Gemini Pro', requests: 28400, cost: 720 },
  { id: '4', slug: 'llama-3-70b', name: 'Llama 3 70B', requests: 18900, cost: 340 },
  { id: '5', slug: 'mistral-large', name: 'Mistral Large', requests: 12600, cost: 280 },
];

const topAgentsData = [
  { id: '1', name: 'Code Assistant', executions: 8920, revenue: 450 },
  { id: '2', name: 'Data Analyst', executions: 6540, revenue: 380 },
  { id: '3', name: 'Research Agent', executions: 4210, revenue: 290 },
  { id: '4', name: 'Translation', executions: 3180, revenue: 180 },
  { id: '5', name: 'SEO Optimizer', executions: 2890, revenue: 150 },
];

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        description="Monitor your AI economy system in real-time"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(452000)}
          change={12.5}
          trend="up"
          icon={DollarSign}
        />
        <KPICard
          title="Token Usage"
          value={formatTokens(2850000000)}
          change={8.3}
          trend="up"
          icon={Cpu}
        />
        <KPICard
          title="Active Agents"
          value={formatNumber(1240)}
          change={-2.1}
          trend="down"
          icon={Bot}
        />
        <KPICard
          title="API Requests"
          value={formatNumber(148600)}
          change={15.7}
          trend="up"
          icon={Zap}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Trend */}
        <ChartCard
          title="Request Trend"
          description="API calls over the last 7 days"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={requestTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
              <XAxis dataKey="date" stroke="hsl(240 5% 65%)" fontSize={12} />
              <YAxis stroke="hsl(240 5% 65%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(240 8% 8%)',
                  border: '1px solid hsl(240 5% 20%)',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="hsl(210 100% 60%)"
                fill="hsl(210 100% 60% / 0.1)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost Structure */}
        <ChartCard
          title="Cost Structure"
          description="Revenue distribution breakdown"
        >
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={costStructureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costStructureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(240 8% 8%)',
                    border: '1px solid hsl(240 5% 20%)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {costStructureData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Top Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Models */}
        <ChartCard title="Top Models" description="Most used models this month">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topModelsData.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>{formatNumber(model.requests)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(model.cost * 100)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>

        {/* Top Agents */}
        <ChartCard title="Top Agents" description="Most executed agents this month">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAgentsData.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{formatNumber(agent.executions)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(agent.revenue * 100)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>
      </div>
    </div>
  );
}
