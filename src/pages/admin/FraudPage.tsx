import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Ban, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/formatters';

const mockFraudEvents = [
  { id: '1', user: 'Bad Actor', type: 'self_payment', severity: 'high', riskScore: 85, description: 'Suspicious self-payment pattern', status: 'pending', date: '2026-04-22' },
  { id: '2', user: 'Spam Bot', type: 'rate_limit_exceeded', severity: 'medium', riskScore: 65, description: 'Exceeded rate limit 50x', status: 'reviewed', date: '2026-04-21' },
  { id: '3', user: 'Abuser123', type: 'refund_abuse', severity: 'critical', riskScore: 95, description: 'Multiple refund requests', status: 'blocked', date: '2026-04-20' },
  { id: '4', user: 'Normal User', type: 'token_anomaly', severity: 'low', riskScore: 25, description: 'Unusual token pattern', status: 'reviewed', date: '2026-04-19' },
];

export function FraudPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fraud Detection"
        description="Monitor and manage fraud events"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Events" value={245} change={8.3} trend="up" icon={Shield} />
        <KPICard title="High Risk" value={42} change={-12.5} trend="down" icon={AlertTriangle} />
        <KPICard title="Reviewed" value={180} change={15.2} trend="up" icon={CheckCircle} />
        <KPICard title="Blocked" value={23} change={5.8} trend="up" icon={Ban} />
      </div>

      <ChartCard title="Fraud Events" description="Recent fraud alerts">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFraudEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.user}</TableCell>
                <TableCell><Badge variant="secondary">{event.type}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${event.riskScore > 80 ? 'bg-red-500' : event.riskScore > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${event.riskScore}%` }}
                      />
                    </div>
                    <span className="text-xs">{event.riskScore}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{event.description}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      event.status === 'reviewed' ? 'default' :
                      event.status === 'blocked' ? 'destructive' : 'secondary'
                    }
                  >
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(event.date)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
