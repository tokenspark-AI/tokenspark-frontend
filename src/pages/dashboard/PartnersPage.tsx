import { Users, TrendingUp, DollarSign, Link2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
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
  { date: '04-16', tier1: 1200, tier2: 450, tier3: 180 },
  { date: '04-17', tier1: 1500, tier2: 520, tier3: 210 },
  { date: '04-18', tier1: 1800, tier2: 610, tier3: 240 },
  { date: '04-19', tier1: 1400, tier2: 480, tier3: 190 },
  { date: '04-20', tier1: 2100, tier2: 720, tier3: 280 },
  { date: '04-21', tier1: 2400, tier2: 800, tier3: 310 },
  { date: '04-22', tier1: 2800, tier2: 920, tier3: 360 },
];

const mockPartners = [
  { id: '1', name: 'Alice Chen', tier: 'agent', referrals: 45, commissionRate: 0.10, totalEarnings: 4520, status: 'active' },
  { id: '2', name: 'Bob Wang', tier: 'partner', referrals: 120, commissionRate: 0.15, totalEarnings: 12800, status: 'active' },
  { id: '3', name: 'Carol Liu', tier: 'enterprise', referrals: 350, commissionRate: 0.20, totalEarnings: 32500, status: 'active' },
  { id: '4', name: 'David Zhang', tier: 'agent', referrals: 28, commissionRate: 0.10, totalEarnings: 2100, status: 'suspended' },
  { id: '5', name: 'Emily Li', tier: 'partner', referrals: 85, commissionRate: 0.12, totalEarnings: 8900, status: 'active' },
];

export function PartnersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Network"
        description="Manage partners, track commissions, and monitor referral network"
        action={
          <Button variant="spark">
            <Link2 className="h-4 w-4 mr-2" />
            Copy Invite Link
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Partners"
          value={formatNumber(1240)}
          change={8.3}
          trend="up"
          icon={Users}
        />
        <KPICard
          title="Total Referrals"
          value={formatNumber(8920)}
          change={12.5}
          trend="up"
          icon={TrendingUp}
        />
        <KPICard
          title="Commission Paid"
          value={formatCurrency(607000)}
          change={15.2}
          trend="up"
          icon={DollarSign}
        />
        <KPICard
          title="Pending Commission"
          value={formatCurrency(85000)}
          change={-3.1}
          trend="down"
          icon={DollarSign}
        />
      </div>

      {/* Commission Trend */}
      <ChartCard
        title="Commission Trend"
        description="Tier-based commission earnings over time"
      >
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
            <Bar dataKey="tier1" name="Tier 1 (Agent)" fill="hsl(210 100% 60%)" />
            <Bar dataKey="tier2" name="Tier 2 (Partner)" fill="hsl(270 80% 60%)" />
            <Bar dataKey="tier3" name="Tier 3 (Enterprise)" fill="hsl(35 100% 60%)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Partners Table */}
      <ChartCard title="Partners" description="All registered partners">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Referrals</TableHead>
              <TableHead className="text-right">Commission Rate</TableHead>
              <TableHead className="text-right">Total Earnings</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPartners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      partner.tier === 'enterprise'
                        ? 'default'
                        : partner.tier === 'partner'
                        ? 'info'
                        : 'secondary'
                    }
                  >
                    {partner.tier}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatNumber(partner.referrals)}</TableCell>
                <TableCell className="text-right">{(partner.commissionRate * 100).toFixed(0)}%</TableCell>
                <TableCell className="text-right">{formatCurrency(partner.totalEarnings * 100)}</TableCell>
                <TableCell>
                  <StatusIndicator status={partner.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
