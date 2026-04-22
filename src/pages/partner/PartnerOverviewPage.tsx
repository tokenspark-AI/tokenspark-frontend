import { Users, TrendingUp, DollarSign, Wallet } from 'lucide-react';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/formatters';

const commissionTrendData = [
  { date: '04-16', tier1: 1200, tier2: 450 },
  { date: '04-17', tier1: 1500, tier2: 520 },
  { date: '04-18', tier1: 1800, tier2: 610 },
  { date: '04-19', tier1: 1400, tier2: 480 },
  { date: '04-20', tier1: 2100, tier2: 720 },
  { date: '04-21', tier1: 2400, tier2: 800 },
  { date: '04-22', tier1: 2800, tier2: 920 },
];

const mockDownline = [
  { id: '1', name: 'Alice Chen', tier: 'agent', customers: 45, volume: 4520, commission: 904 },
  { id: '2', name: 'Bob Wang', tier: 'partner', customers: 120, volume: 12800, commission: 2560 },
  { id: '3', name: 'Carol Liu', tier: 'enterprise', customers: 350, volume: 32500, commission: 6500 },
  { id: '4', name: 'David Zhang', tier: 'agent', customers: 28, volume: 2100, commission: 420 },
];

export function PartnerOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Overview"
        description="Monitor your partner network performance and commissions"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Downline" value={formatNumber(543)} change={12.5} trend="up" icon={Users} />
        <KPICard title="Monthly Volume" value={formatCurrency(51920)} change={8.3} trend="up" icon={TrendingUp} />
        <KPICard title="Total Commissions" value={formatCurrency(10384)} change={15.2} trend="up" icon={DollarSign} />
        <KPICard title="Available Balance" value={formatCurrency(8500)} change={-3.1} trend="down" icon={Wallet} />
      </div>

      <ChartCard title="Commission Trend" description="Tier-based commission earnings">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={commissionTrendData}>
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
            <Bar dataKey="tier1" name="Tier 1" fill="hsl(210 100% 60%)" />
            <Bar dataKey="tier2" name="Tier 2" fill="hsl(270 80% 60%)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Downline Partners" description="Highest performing partners in your network">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Customers</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDownline.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell>
                  <Badge variant={partner.tier === 'enterprise' ? 'default' : partner.tier === 'partner' ? 'info' : 'secondary'}>
                    {partner.tier}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatNumber(partner.customers)}</TableCell>
                <TableCell className="text-right">{formatCurrency(partner.volume)}</TableCell>
                <TableCell className="text-right">{formatCurrency(partner.commission)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
