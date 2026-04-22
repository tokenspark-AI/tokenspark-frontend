import { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsTrigger } from '@/components/ui/tabs';
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
import { paymentMethods } from '@/lib/constants';

const mockBalance = {
  balance: 250000,
  reserved: 35000,
  available: 215000,
};

const mockTransactions = [
  { id: 'TXN-001', date: '2026-04-22 10:30', type: 'topup', amount: 100000, status: 'completed', method: 'stripe' },
  { id: 'TXN-002', date: '2026-04-21 15:20', type: 'charge', amount: -3200, status: 'completed', method: 'api' },
  { id: 'TXN-003', date: '2026-04-21 09:10', type: 'topup', amount: 50000, status: 'completed', method: 'alipay' },
  { id: 'TXN-004', date: '2026-04-20 18:45', type: 'charge', amount: -5600, status: 'completed', method: 'api' },
  { id: 'TXN-005', date: '2026-04-20 12:00', type: 'charge', amount: -1200, status: 'completed', method: 'agent' },
  { id: 'TXN-006', date: '2026-04-19 08:30', type: 'topup', amount: 200000, status: 'completed', method: 'wechat_pay' },
];

const [activeTab, setActiveTab] = useState<'overview' | 'topup'>('overview');

export function WalletPage() {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('stripe');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet"
        description="Manage your balance, top up, and view transactions"
      />

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-6 glow-border">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold">{formatCurrency(mockBalance.balance)}</div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Available</p>
            <div className="p-2 rounded-lg bg-green-500/10">
              <ArrowDownRight className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-400">{formatCurrency(mockBalance.available)}</div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Reserved</p>
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <ArrowUpRight className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{formatCurrency(mockBalance.reserved)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Transactions
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'topup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('topup')}
        >
          Top Up
        </button>
      </div>

      {activeTab === 'overview' ? (
        <ChartCard title="Transaction History" description="All wallet transactions">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
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
                      {txn.type === 'topup' ? 'Top Up' : 'Charge'}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{txn.method.replace('_', ' ')}</TableCell>
                  <TableCell className={`text-right font-medium ${txn.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">{txn.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>
      ) : (
        <ChartCard title="Top Up Wallet" description="Add funds using your preferred payment method">
          <div className="max-w-md space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full h-10 pl-8 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="100.00"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedMethod === method.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted'
                    }`}
                    onClick={() => setSelectedMethod(method.value)}
                  >
                    <CreditCard className="h-5 w-5 mb-2" />
                    <p className="text-sm font-medium">{method.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button variant="spark" className="w-full">
              Top Up {topUpAmount ? `$${topUpAmount}` : ''}
            </Button>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
