import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Wallet, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/formatters';

const mockCommissions = [
  { id: '1', source: 'Alice Chen', tier: 1, amount: 450, status: 'available', date: '2026-04-22' },
  { id: '2', source: 'Bob Wang', tier: 1, amount: 1280, status: 'available', date: '2026-04-21' },
  { id: '3', source: 'Carol Liu', tier: 1, amount: 3250, status: 'pending', date: '2026-04-20' },
  { id: '4', source: 'Sub Agent A', tier: 2, amount: 200, status: 'available', date: '2026-04-19' },
  { id: '5', source: 'Sub Partner B', tier: 2, amount: 640, status: 'paid', date: '2026-04-18' },
];

export function CommissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissions"
        description="Manage your commission earnings and withdrawals"
        action={
          <Button variant="spark">
            <Download className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Earned" value={formatCurrency(103840)} change={15.2} trend="up" icon={DollarSign} />
        <KPICard title="Available" value={formatCurrency(8500)} change={8.3} trend="up" icon={Wallet} />
        <KPICard title="Pending" value={formatCurrency(3250)} change={-3.1} trend="down" icon={TrendingUp} />
        <KPICard title="Paid Out" value={formatCurrency(92090)} change={12.5} trend="up" icon={DollarSign} />
      </div>

      <ChartCard title="Commission History" description="All commission transactions">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCommissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell className="font-medium">{commission.source}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Tier {commission.tier}</Badge>
                </TableCell>
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
