import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  healthy: 'bg-green-400',
  active: 'bg-green-400',
  completed: 'bg-green-400',
  success: 'bg-green-400',
  available: 'bg-green-400',
  paid: 'bg-green-400',
  degraded: 'bg-yellow-400',
  pending: 'bg-yellow-400',
  pending_verification: 'bg-yellow-400',
  processing: 'bg-yellow-400',
  down: 'bg-red-400',
  failed: 'bg-red-400',
  suspended: 'bg-red-400',
  banned: 'bg-red-400',
  maintenance: 'bg-blue-400',
  reversed: 'bg-gray-400',
};

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const color = statusColors[status] || 'bg-gray-400';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("h-2 w-2 rounded-full animate-pulse", color)} />
      <span className="text-sm capitalize">{status.replace(/_/g, ' ')}</span>
    </div>
  );
}
