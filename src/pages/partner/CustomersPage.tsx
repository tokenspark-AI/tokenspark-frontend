import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, DollarSign, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/formatters';

const mockCustomers = [
  { id: '1', name: 'Tech Corp', email: 'admin@techcorp.com', usage: 12500, spent: 312.50, status: 'active', joinedAt: '2026-03-15' },
  { id: '2', name: 'StartupXYZ', email: 'dev@startupxyz.io', usage: 8200, spent: 164.00, status: 'active', joinedAt: '2026-04-01' },
  { id: '3', name: 'AI Lab', email: 'research@ailab.com', usage: 45000, spent: 1125.00, status: 'active', joinedAt: '2026-02-20' },
  { id: '4', name: 'Dev Studio', email: 'team@devstudio.co', usage: 3200, spent: 80.00, status: 'suspended', joinedAt: '2026-04-10' },
  { id: '5', name: 'DataFlow', email: 'api@dataflow.ai', usage: 28000, spent: 700.00, status: 'active', joinedAt: '2026-01-05' },
];

export function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your downstream customers"
        action={
          <Button variant="spark">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Customers" value={formatNumber(543)} change={12.5} trend="up" icon={Users} />
        <KPICard title="Active Customers" value={formatNumber(498)} change={8.3} trend="up" icon={Users} />
        <KPICard title="Total Usage" value={formatNumber(96900)} change={15.2} trend="up" icon={TrendingUp} />
        <KPICard title="Total Revenue" value={formatCurrency(238150)} change={10.8} trend="up" icon={DollarSign} />
      </div>

      <ChartCard title="Customer List" description="All customers in your network">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">API Usage</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-xs text-muted-foreground">{customer.email}</div>
                </TableCell>
                <TableCell className="text-right">{formatNumber(customer.usage)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(customer.spent)}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>{customer.joinedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
