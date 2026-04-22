import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface TreeNode {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: string;
  customers: number;
  commission: number;
  children?: TreeNode[];
}

const mockTree: TreeNode[] = [
  {
    id: '1',
    name: 'Alice Chen',
    email: 'alice@example.com',
    tier: 'agent',
    status: 'active',
    customers: 45,
    commission: 904,
    children: [
      {
        id: '1-1',
        name: 'Sub Agent A',
        email: 'suba@example.com',
        tier: 'agent',
        status: 'active',
        customers: 20,
        commission: 400,
      },
      {
        id: '1-2',
        name: 'Sub Agent B',
        email: 'subb@example.com',
        tier: 'agent',
        status: 'active',
        customers: 25,
        commission: 504,
      },
    ],
  },
  {
    id: '2',
    name: 'Bob Wang',
    email: 'bob@example.com',
    tier: 'partner',
    status: 'active',
    customers: 120,
    commission: 2560,
    children: [
      {
        id: '2-1',
        name: 'Sub Partner A',
        email: 'subp@example.com',
        tier: 'agent',
        status: 'active',
        customers: 60,
        commission: 1280,
      },
    ],
  },
  {
    id: '3',
    name: 'Carol Liu',
    email: 'carol@example.com',
    tier: 'enterprise',
    status: 'active',
    customers: 350,
    commission: 6500,
  },
];

function TreeNodeComponent({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-3 py-3 px-4 hover:bg-secondary/30 rounded-lg transition-colors"
        style={{ paddingLeft: `${level * 24 + 16}px` }}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-secondary rounded">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <div className="w-6" />
        )}
        <div className="flex-1 grid grid-cols-4 gap-4 items-center">
          <div>
            <div className="font-medium">{node.name}</div>
            <div className="text-xs text-muted-foreground">{node.email}</div>
          </div>
          <div>
            <Badge variant={node.tier === 'enterprise' ? 'default' : node.tier === 'partner' ? 'info' : 'secondary'}>
              {node.tier}
            </Badge>
          </div>
          <div className="text-right flex items-center justify-end gap-2">
            <Users className="h-3 w-3 text-muted-foreground" />
            {node.customers}
          </div>
          <div className="text-right flex items-center justify-end gap-2">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            {formatCurrency(node.commission)}
          </div>
        </div>
      </div>
      {expanded && hasChildren && node.children?.map((child) => (
        <TreeNodeComponent key={child.id} node={child} level={level + 1} />
      ))}
    </div>
  );
}

export function DownlinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Downline Network"
        description="Visualize your partner distribution network"
      />

      <ChartCard title="Partner Tree" description="Hierarchical view of your downline">
        <div className="space-y-2">
          <div className="flex items-center gap-3 py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="w-6" />
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div>Name</div>
              <div>Tier</div>
              <div className="text-right">Customers</div>
              <div className="text-right">Commission</div>
            </div>
          </div>
          {mockTree.map((node) => (
            <TreeNodeComponent key={node.id} node={node} />
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
