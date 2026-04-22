import { Repeat, Clock, DollarSign, Users } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
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
import { formatCurrency, formatDate } from '@/lib/formatters';

const mockSettlements = [
  { id: 'STL-001', date: '2026-04-22', type: 't0', totalAmount: 45200, agentPayout: 28000, partnerPayout: 4500, platformRevenue: 12700, status: 'completed' },
  { id: 'STL-002', date: '2026-04-21', type: 't1', totalAmount: 38900, agentPayout: 24100, partnerPayout: 3900, platformRevenue: 10900, status: 'completed' },
  { id: 'STL-003', date: '2026-04-20', type: 't0', totalAmount: 52100, agentPayout: 32300, partnerPayout: 5200, platformRevenue: 14600, status: 'completed' },
  { id: 'STL-004', date: '2026-04-19', type: 't1', totalAmount: 41800, agentPayout: 25900, partnerPayout: 4200, platformRevenue: 11700, status: 'processing' },
  { id: 'STL-005', date: '2026-04-18', type: 't0', totalAmount: 36500, agentPayout: 22600, partnerPayout: 3600, platformRevenue: 10300, status: 'pending' },
];

export function SettlementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settlement"
        description="T+0/T+1 settlement status and payout records"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Settled"
          value={formatCurrency(2145000)}
          change={11.2}
          trend="up"
          icon={DollarSign}
        />
        <KPICard
          title="Agent Payouts"
          value={formatCurrency(1329000)}
          change={10.5}
          trend="up"
          icon={Users}
        />
        <KPICard
          title="Partner Payouts"
          value={formatCurrency(214000)}
          change={14.8}
          trend="up"
          icon={Repeat}
        />
        <KPICard
          title="Pending Settlement"
          value={formatCurrency(78600)}
          change={-5.2}
          trend="down"
          icon={Clock}
        />
      </div>

      {/* Settlement Records */}
      <ChartCard title="Settlement History" description="All settlement records">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Settlement ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-right">Agent Payout</TableHead>
              <TableHead className="text-right">Partner Payout</TableHead>
              <TableHead className="text-right">Platform Revenue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSettlements.map((settlement) => (
              <TableRow key={settlement.id}>
                <TableCell className="font-mono text-sm">{settlement.id}</TableCell>
                <TableCell>{formatDate(settlement.date)}</TableCell>
                <TableCell>
                  <Badge variant={settlement.type === 't0' ? 'default' : 'info'}>
                    {settlement.type === 't0' ? 'T+0' : 'T+1'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(settlement.totalAmount * 100)}</TableCell>
                <TableCell className="text-right">{formatCurrency(settlement.agentPayout * 100)}</TableCell>
                <TableCell className="text-right">{formatCurrency(settlement.partnerPayout * 100)}</TableCell>
                <TableCell className="text-right">{formatCurrency(settlement.platformRevenue * 100)}</TableCell>
                <TableCell>
                  <StatusIndicator status={settlement.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
