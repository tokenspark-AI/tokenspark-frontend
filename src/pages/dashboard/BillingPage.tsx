import { DollarSign, TrendingUp, CreditCard, Bot } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber } from '@/lib/formatters';

const mockOrders = [
  { id: 'ORD-001', user: 'Alice', model: 'GPT-4.1', tokens: 1200, cost: 0.03, status: 'completed', type: 'API' },
  { id: 'ORD-002', user: 'Bob', model: 'Code Assistant', tokens: 0, cost: 0.12, status: 'completed', type: 'Agent' },
  { id: 'ORD-003', user: 'Charlie', model: 'Claude 3 Opus', tokens: 2400, cost: 0.08, status: 'completed', type: 'API' },
  { id: 'ORD-004', user: 'Diana', model: 'Data Analyst', tokens: 0, cost: 0.15, status: 'pending', type: 'Agent' },
  { id: 'ORD-005', user: 'Eve', model: 'Gemini Pro', tokens: 800, cost: 0.02, status: 'completed', type: 'API' },
  { id: 'ORD-006', user: 'Frank', model: 'Translation', tokens: 0, cost: 0.05, status: 'completed', type: 'Agent' },
];

export function BillingPage() {
  const apiRevenue = 325000;
  const agentRevenue = 127000;
  const totalRevenue = apiRevenue + agentRevenue;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Revenue"
        description="Track income, orders, and token consumption"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(totalRevenue * 100)}
          change={14.2}
          trend="up"
          icon={DollarSign}
        />
        <KPICard
          title="API Revenue"
          value={formatCurrency(apiRevenue * 100)}
          change={12.8}
          trend="up"
          icon={CreditCard}
        />
        <KPICard
          title="Agent Revenue"
          value={formatCurrency(agentRevenue * 100)}
          change={18.5}
          trend="up"
          icon={Bot}
        />
        <KPICard
          title="Avg Order Value"
          value="$4.52"
          change={3.2}
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Revenue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Split" description="API vs Agent revenue distribution">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>API Calls</span>
                <span className="font-medium">{formatCurrency(apiRevenue * 100)} ({((apiRevenue / totalRevenue) * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-4 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(apiRevenue / totalRevenue) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Agent Tasks</span>
                <span className="font-medium">{formatCurrency(agentRevenue * 100)} ({((agentRevenue / totalRevenue) * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-4 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-spark rounded-full transition-all duration-300"
                  style={{ width: `${(agentRevenue / totalRevenue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Top Spending Models" description="Highest revenue generating models">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: 'GPT-4.1', orders: 45200, revenue: 125000 },
                { name: 'Claude 3 Opus', orders: 32100, revenue: 98000 },
                { name: 'Gemini Pro', orders: 28400, revenue: 72000 },
                { name: 'Code Assistant', orders: 8920, revenue: 45000 },
              ].map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{formatNumber(item.orders)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.revenue * 100)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>
      </div>

      {/* Orders Table */}
      <ChartCard title="Recent Orders" description="Latest billing transactions">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Model/Agent</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell>{order.user}</TableCell>
                <TableCell>
                  <Badge variant={order.type === 'API' ? 'info' : 'default'}>
                    {order.type}
                  </Badge>
                </TableCell>
                <TableCell>{order.model}</TableCell>
                <TableCell>{order.tokens > 0 ? formatNumber(order.tokens) : '-'}</TableCell>
                <TableCell>{formatCurrency(order.cost * 100)}</TableCell>
                <TableCell>
                  <Badge
                    variant={order.status === 'completed' ? 'success' : 'warning'}
                  >
                    {order.status}
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
