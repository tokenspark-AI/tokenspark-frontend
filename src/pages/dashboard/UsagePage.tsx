import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Cpu } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatCurrency, formatTokens, formatNumber } from '@/lib/formatters';

const usageTrendData = [
  { date: '04-16', requests: 12500, tokens: 450000000, cost: 45 },
  { date: '04-17', requests: 15200, tokens: 520000000, cost: 52 },
  { date: '04-18', requests: 18900, tokens: 610000000, cost: 61 },
  { date: '04-19', requests: 16400, tokens: 550000000, cost: 55 },
  { date: '04-20', requests: 22100, tokens: 720000000, cost: 72 },
  { date: '04-21', requests: 24800, tokens: 800000000, cost: 80 },
  { date: '04-22', requests: 28500, tokens: 920000000, cost: 92 },
];

const modelUsageData = [
  { name: 'GPT-4.1', inputTokens: 180000000, outputTokens: 120000000 },
  { name: 'Claude 3', inputTokens: 140000000, outputTokens: 95000000 },
  { name: 'Gemini', inputTokens: 100000000, outputTokens: 70000000 },
  { name: 'Llama 3', inputTokens: 80000000, outputTokens: 50000000 },
  { name: 'Mistral', inputTokens: 50000000, outputTokens: 35000000 },
];

const costBreakdownData = [
  { name: 'API Calls', value: 65, color: '#3b82f6' },
  { name: 'Agent Tasks', value: 25, color: '#8b5cf6' },
  { name: 'Other', value: 10, color: '#f59e0b' },
];

export function UsagePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Usage Analytics"
        description="Analyze your API and agent usage patterns"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Requests"
          value={formatNumber(148600)}
          change={15.7}
          trend="up"
          icon={BarChart3}
        />
        <KPICard
          title="Total Tokens"
          value={formatTokens(4600000000)}
          change={12.3}
          trend="up"
          icon={Cpu}
        />
        <KPICard
          title="Total Cost"
          value={formatCurrency(452000)}
          change={8.5}
          trend="up"
          icon={DollarSign}
        />
        <KPICard
          title="Avg Cost/Request"
          value="$3.04"
          change={-2.1}
          trend="down"
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trend */}
        <ChartCard
          title="Usage Trend"
          description="Requests over the last 7 days"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={usageTrendData}>
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
              <Line
                type="monotone"
                dataKey="requests"
                stroke="hsl(210 100% 60%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost Trend */}
        <ChartCard
          title="Cost Trend"
          description="Daily spending over the last 7 days"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={usageTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
              <XAxis dataKey="date" stroke="hsl(240 5% 65%)" fontSize={12} />
              <YAxis stroke="hsl(240 5% 65%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(240 8% 8%)',
                  border: '1px solid hsl(240 5% 20%)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => formatCurrency(value * 100)}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="hsl(35 100% 60%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Usage */}
        <ChartCard
          title="Model Usage"
          description="Token usage by model (input vs output)"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={modelUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
              <XAxis dataKey="name" stroke="hsl(240 5% 65%)" fontSize={12} />
              <YAxis stroke="hsl(240 5% 65%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(240 8% 8%)',
                  border: '1px solid hsl(240 5% 20%)',
                  borderRadius: '8px',
                }}
                formatter={(value) => formatTokens(value as number)}
              />
              <Legend />
              <Bar dataKey="inputTokens" name="Input" fill="hsl(210 100% 60%)" />
              <Bar dataKey="outputTokens" name="Output" fill="hsl(270 80% 60%)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost Breakdown */}
        <ChartCard
          title="Cost Breakdown"
          description="API vs Agent spending"
        >
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(240 8% 8%)',
                    border: '1px solid hsl(240 5% 20%)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
