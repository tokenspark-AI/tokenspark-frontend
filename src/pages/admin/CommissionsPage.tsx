import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Wallet, Download, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatNumber, formatDate } from '@/lib/formatters';

const mockCommissions = [
  { id: '1', partner: 'Alice Chen', tier: 1, source: 'Tech Corp', amount: 450, status: 'pending', date: '2026-04-22' },
  { id: '2', partner: 'Bob Wang', tier: 1, source: 'StartupXYZ', amount: 1280, status: 'available', date: '2026-04-21' },
  { id: '3', partner: 'Carol Liu', tier: 1, source: 'AI Lab', amount: 3250, status: 'available', date: '2026-04-20' },
  { id: '4', partner: 'Sub Agent A', tier: 2, source: 'Dev Studio', amount: 200, status: 'paid', date: '2026-04-19' },
  { id: '5', partner: 'Sub Partner B', tier: 2, source: 'DataFlow', amount: 640, status: 'paid', date: '2026-04-18' },
];

export function AdminCommissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission Management"
        description="Global commission settlement and rules"
        action={
          <Button variant="spark">
            <CheckCircle className="h-4 w-4 mr-2" />
            Batch Settle
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Paid" value={formatCurrency(607000)} change={15.2} trend="up" icon={DollarSign} />
        <KPICard title="Pending" value={formatCurrency(85000)} change={-3.1} trend="down" icon={Wallet} />
        <KPICard title="This Month" value={formatCurrency(121640)} change={12.5} trend="up" icon={TrendingUp} />
        <KPICard title="Settlements" value={formatNumber(1240)} change={8.3} trend="up" icon={Download} />
      </div>

      <ChartCard title="Commission Transactions" description="All commission records">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCommissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell className="font-medium">{commission.partner}</TableCell>
                <TableCell><Badge variant="secondary">Tier {commission.tier}</Badge></TableCell>
                <TableCell>{commission.source}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(commission.amount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      commission.status === 'available' ? 'default' :
                      commission.status === 'paid' ? 'info' : 'secondary'
                    }
                  >
                    {commission.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(commission.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
