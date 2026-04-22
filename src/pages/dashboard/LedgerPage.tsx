import { BookOpen, Search } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
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
import { formatCurrency, formatDate } from '@/lib/formatters';

const mockTransactions = [
  {
    id: 'TXN-001',
    date: '2026-04-22 10:30:00',
    type: 'charge',
    status: 'completed',
    totalAmount: 3100,
    entries: [
      { id: 'E1', type: 'debit', account: 'user_wallet', amount: 3100 },
      { id: 'E2', type: 'credit', account: 'system_revenue', amount: 930 },
      { id: 'E3', type: 'credit', account: 'provider_payable', amount: 2170 },
    ],
  },
  {
    id: 'TXN-002',
    date: '2026-04-22 10:29:45',
    type: 'charge',
    status: 'completed',
    totalAmount: 9800,
    entries: [
      { id: 'E1', type: 'debit', account: 'user_wallet', amount: 9800 },
      { id: 'E2', type: 'credit', account: 'system_revenue', amount: 2940 },
      { id: 'E3', type: 'credit', account: 'provider_payable', amount: 6860 },
    ],
  },
  {
    id: 'TXN-003',
    date: '2026-04-22 10:28:12',
    type: 'commission_payout',
    status: 'completed',
    totalAmount: 1200,
    entries: [
      { id: 'E1', type: 'debit', account: 'partner_commission', amount: 1200 },
      { id: 'E2', type: 'credit', account: 'user_wallet', amount: 1200 },
    ],
  },
  {
    id: 'TXN-004',
    date: '2026-04-21 15:20:00',
    type: 'topup',
    status: 'completed',
    totalAmount: 100000,
    entries: [
      { id: 'E1', type: 'debit', account: 'payment_gateway', amount: 100000 },
      { id: 'E2', type: 'credit', account: 'user_wallet', amount: 100000 },
    ],
  },
];

export function LedgerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Double-Entry Ledger"
        description="Auditable transaction records with debit/credit pairs"
      />

      {/* Ledger Transactions */}
      <ChartCard title="Transaction History" description="All ledger transactions">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Entries</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                <TableCell>{formatDate(txn.date)}</TableCell>
                <TableCell>
                  <Badge variant={txn.type === 'topup' ? 'success' : 'default'}>
                    {txn.type.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(txn.totalAmount)}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{txn.entries.length} entries</span>
                </TableCell>
                <TableCell>
                  <Badge variant="success">{txn.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>

      {/* Transaction Detail Example */}
      <ChartCard title="Transaction Detail Example" description="TXN-001 - Double-entry breakdown">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Debit */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-400">Debit</h4>
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>User Wallet</TableCell>
                    <TableCell className="text-right text-red-400">{formatCurrency(3100)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Credit */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-400">Credit</h4>
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>System Revenue</TableCell>
                    <TableCell className="text-right text-green-400">{formatCurrency(930)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Provider Payable</TableCell>
                    <TableCell className="text-right text-green-400">{formatCurrency(2170)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">
            Invariant check: <span className="text-green-400 font-medium">Balanced</span> - Total Debit ({formatCurrency(3100)}) = Total Credit ({formatCurrency(3100)})
          </p>
        </div>
      </ChartCard>
    </div>
  );
}
