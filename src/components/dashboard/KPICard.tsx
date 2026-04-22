import { cn } from '@/lib/utils';
import type { KPICardProps } from '@/types/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  loading = false,
}: KPICardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-green-400'
      : trend === 'down'
      ? 'text-red-400'
      : 'text-muted-foreground';

  const changePrefix = change !== undefined ? (change >= 0 ? '+' : '') : '';

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 glow-border">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {change !== undefined && (
        <p className={cn("text-xs font-medium", trendColor)}>
          {changePrefix}{change.toFixed(1)}% from last period
        </p>
      )}
    </div>
  );
}
