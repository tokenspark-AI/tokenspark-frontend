import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Network, Users, DollarSign, TrendingUp, Search, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/formatters';

const mockPartners = [
  { id: '1', name: 'Alice Chen', email: 'alice@partner.com', tier: 'agent', parent: 'Bob Wang', downline: 45, volume: 45200, commission: 9040, status: 'active' },
  { id: '2', name: 'Bob Wang', email: 'bob@partner.com', tier: 'partner', parent: 'Platform', downline: 120, volume: 128000, commission: 25600, status: 'active' },
  { id: '3', name: 'Carol Liu', email: 'carol@enterprise.com', tier: 'enterprise', parent: 'Platform', downline: 350, volume: 325000, commission: 65000, status: 'active' },
  { id: '4', name: 'David Zhang', email: 'david@agent.com', tier: 'agent', parent: 'Alice Chen', downline: 28, volume: 21000, commission: 4200, status: 'suspended' },
  { id: '5', name: 'Emily Li', email: 'emily@partner.com', tier: 'partner', parent: 'Carol Liu', downline: 85, volume: 89000, commission: 17800, status: 'active' },
];

export function AdminPartnersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Management"
        description="Manage all partners and commission rules"
        action={
          <Button variant="spark">
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Partners" value={formatNumber(245)} change={12.5} trend="up" icon={Network} />
        <KPICard title="Total Downline" value={formatNumber(628)} change={8.3} trend="up" icon={Users} />
        <KPICard title="Total Volume" value={formatCurrency(608200)} change={15.2} trend="up" icon={TrendingUp} />
        <KPICard title="Total Commission" value={formatCurrency(121640)} change={10.8} trend="up" icon={DollarSign} />
      </div>

      <ChartCard title="Partner Directory" description="Search and filter partners">
        <div className="mb-4 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search partners..." className="pl-10" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="text-right">Downline</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPartners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>
                  <div className="font-medium">{partner.name}</div>
                  <div className="text-xs text-muted-foreground">{partner.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={partner.tier === 'enterprise' ? 'default' : partner.tier === 'partner' ? 'info' : 'secondary'}>
                    {partner.tier}
                  </Badge>
                </TableCell>
                <TableCell>{partner.parent}</TableCell>
                <TableCell className="text-right">{formatNumber(partner.downline)}</TableCell>
                <TableCell className="text-right">{formatCurrency(partner.volume)}</TableCell>
                <TableCell className="text-right">{formatCurrency(partner.commission)}</TableCell>
                <TableCell>
                  <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                    {partner.status}
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
