import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, UserCheck, UserX, Search, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/formatters';

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', type: 'individual', status: 'active', balance: 125.50, usage: 5000, joinedAt: '2026-03-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@startup.io', type: 'individual', status: 'active', balance: 89.00, usage: 3200, joinedAt: '2026-04-01' },
  { id: '3', name: 'Tech Corp', email: 'admin@techcorp.com', type: 'enterprise', status: 'active', balance: 1250.00, usage: 45000, joinedAt: '2026-02-20' },
  { id: '4', name: 'Bad Actor', email: 'spam@example.com', type: 'individual', status: 'suspended', balance: 0, usage: 100, joinedAt: '2026-04-10' },
  { id: '5', name: 'DataFlow AI', email: 'api@dataflow.ai', type: 'enterprise', status: 'active', balance: 890.00, usage: 28000, joinedAt: '2026-01-05' },
];

export function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage all platform users"
        action={
          <Button variant="spark">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users" value={formatNumber(12540)} change={8.3} trend="up" icon={Users} />
        <KPICard title="Active Users" value={formatNumber(11890)} change={5.2} trend="up" icon={UserCheck} />
        <KPICard title="Suspended" value={formatNumber(650)} change={-2.1} trend="down" icon={UserX} />
        <KPICard title="Total Balance" value={formatCurrency(2381500)} change={12.5} trend="up" icon={Users} />
      </div>

      <ChartCard title="User Directory" description="Search and manage users">
        <div className="mb-4 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-10" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.type === 'enterprise' ? 'default' : 'secondary'}>
                    {user.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(user.balance)}</TableCell>
                <TableCell className="text-right">{formatNumber(user.usage)}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.joinedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
