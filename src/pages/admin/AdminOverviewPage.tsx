import { Users, Network, DollarSign, Activity, Server, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/formatters';

const revenueTrendData = [
  { date: '04-16', revenue: 12000, costs: 8000, profit: 4000 },
  { date: '04-17', revenue: 15000, costs: 9500, profit: 5500 },
  { date: '04-18', revenue: 18000, costs: 11000, profit: 7000 },
  { date: '04-19', revenue: 14000, costs: 9000, profit: 5000 },
  { date: '04-20', revenue: 21000, costs: 13000, profit: 8000 },
  { date: '04-21', revenue: 24000, costs: 14500, profit: 9500 },
  { date: '04-22', revenue: 28000, costs: 16000, profit: 12000 },
];

const partnerPerformanceData = [
  { name: 'Partner A', partners: 45, revenue: 45200 },
  { name: 'Partner B', partners: 120, revenue: 128000 },
  { name: 'Partner C', partners: 350, revenue: 325000 },
  { name: 'Partner D', partners: 28, revenue: 21000 },
  { name: 'Partner E', partners: 85, revenue: 89000 },
];

const mockPartners = [
  { id: '1', name: 'Alice Chen', tier: 'agent', downline: 45, volume: 45200, commission: 9040, status: 'active' },
  { id: '2', name: 'Bob Wang', tier: 'partner', downline: 120, volume: 128000, commission: 25600, status: 'active' },
  { id: '3', name: 'Carol Liu', tier: 'enterprise', downline: 350, volume: 325000, commission: 65000, status: 'active' },
  { id: '4', name: 'David Zhang', tier: 'agent', downline: 28, volume: 21000, commission: 4200, status: 'suspended' },
];

export function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        description="Global platform performance and system health"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users" value={formatNumber(12540)} change={8.3} trend="up" icon={Users} />
        <KPICard title="Total Partners" value={formatNumber(245)} change={12.5} trend="up" icon={Network} />
        <KPICard title="Total Revenue" value={formatCurrency(607000)} change={15.2} trend="up" icon={DollarSign} />
        <KPICard title="System Health" value="99.9%" change={0.1} trend="up" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend" description="Daily revenue, costs, and profit">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueTrendData}>
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
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(210 100% 60%)" fill="hsl(210 100% 60% / 0.2)" />
              <Area type="monotone" dataKey="costs" name="Costs" stroke="hsl(0 100% 60%)" fill="hsl(0 100% 60% / 0.2)" />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="hsl(140 100% 50%)" fill="hsl(140 100% 50% / 0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Partner Performance" description="Revenue by partner">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={partnerPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
              <XAxis dataKey="name" stroke="hsl(240 5% 65%)" fontSize={12} />
              <YAxis stroke="hsl(240 5% 65%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(240 8% 8%)',
                  border: '1px solid hsl(240 5% 20%)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="revenue" name="Revenue" fill="hsl(270 80% 60%)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top Partners" description="Highest performing partners">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Downline</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPartners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell>
                  <Badge variant={partner.tier === 'enterprise' ? 'default' : partner.tier === 'partner' ? 'info' : 'secondary'}>
                    {partner.tier}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatNumber(partner.downline)}</TableCell>
                <TableCell className="text-right">{formatCurrency(partner.volume)}</TableCell>
                <TableCell className="text-right">{formatCurrency(partner.commission)}</TableCell>
                <TableCell>
                  <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                    {partner.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
