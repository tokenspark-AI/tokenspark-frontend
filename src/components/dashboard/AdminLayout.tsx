import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useUIStore } from '@/stores/ui-store';
import { adminNavItems, adminGroupLabels } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { sidebarOpen, closeSidebar } = useUIStore();
  const [sidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-shrink-0 transition-all duration-300",
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
        )}
      >
        <div className="flex flex-col w-64">
          <Sidebar
            collapsed={sidebarCollapsed}
            navItems={adminNavItems}
            groupLabels={adminGroupLabels}
          />
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
            <Sidebar
              navItems={adminNavItems}
              groupLabels={adminGroupLabels}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
