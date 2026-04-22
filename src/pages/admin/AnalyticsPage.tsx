import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { TrendingUp, Users, DollarSign, Cpu } from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/formatters';

const userGrowthData = [
  { date: '04-16', users: 11500, active: 8200 },
  { date: '04-17', users: 11700, active: 8500 },
  { date: '04-18', users: 11900, active: 8700 },
  { date: '04-19', users: 12100, active: 8900 },
  { date: '04-20', users: 12300, active: 9200 },
  { date: '04-21', users: 12450, active: 9400 },
  { date: '04-22', users: 12540, active: 9600 },
];

const modelUsageData = [
  { name: 'GPT-4o', value: 35 },
  { name: 'Claude 3', value: 28 },
  { name: 'DeepSeek V3', value: 18 },
  { name: 'Gemini', value: 12 },
  { name: 'Others', value: 7 },
];

const COLORS = ['hsl(210 100% 60%)', 'hsl(270 80% 60%)', 'hsl(140 100% 50%)', 'hsl(35 100% 60%)', 'hsl(240 5% 40%)'];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Platform-wide analytics and insights"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users" value={formatNumber(12540)} change={8.3} trend="up" icon={Users} />
        <KPICard title="Daily Active" value={formatNumber(9600)} change={5.2} trend="up" icon={Users} />
        <KPICard title="API Calls/Day" value={formatNumber(50000)} change={15.2} trend="up" icon={Cpu} />
        <KPICard title="Avg Revenue/User" value={formatCurrency(48.40)} change={3.1} trend="up" icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Growth" description="User acquisition over time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
              <XAxis dataKey="date" stroke="hsl(240 5% 65%)" fontSize={12} />
              <YAxis stroke="hsl(240 5% 65%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(240 8% 8%)',
                  border: '1px solid hsl(240 5% 20%)',
                  borderRadius: '8px',
                }}
              />
              <Area type="monotone" dataKey="users" name="Total Users" stroke="hsl(210 100% 60%)" fill="hsl(210 100% 60% / 0.2)" />
              <Area type="monotone" dataKey="active" name="Active Users" stroke="hsl(140 100% 50%)" fill="hsl(140 100% 50% / 0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Model Usage Distribution" description="API calls by model">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={modelUsageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {modelUsageData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(240 8% 8%)',
                  border: '1px solid hsl(240 5% 20%)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {modelUsageData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
