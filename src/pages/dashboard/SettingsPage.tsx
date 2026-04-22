import { useState } from 'react';
import { Plus, Trash2, User, Shield, Bell } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { maskApiKey, formatDate } from '@/lib/formatters';
import { rateLimitTiers } from '@/lib/constants';

const mockApiKeys = [
  { id: '1', prefix: 'tsk_live_abc', name: 'Production Key', tier: 'standard', lastUsed: '2026-04-22 10:30', createdAt: '2026-01-15', isActive: true },
  { id: '2', prefix: 'tsk_live_def', name: 'Development Key', tier: 'free', lastUsed: '2026-04-21 15:20', createdAt: '2026-02-20', isActive: true },
  { id: '3', prefix: 'tsk_live_ghi', name: 'Testing Key', tier: 'free', lastUsed: '2026-04-18 09:10', createdAt: '2026-03-10', isActive: false },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'api-keys' | 'profile' | 'notifications'>('api-keys');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage API keys, profile, and system preferences"
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'api-keys' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('api-keys')}
        >
          API Keys
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'profile' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'notifications' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      {activeTab === 'api-keys' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">API Keys</h3>
              <p className="text-sm text-muted-foreground">Manage your API keys for accessing the TokenSpark API</p>
            </div>
            <Button variant="spark">
              <Plus className="h-4 w-4 mr-2" />
              Create Key
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockApiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {maskApiKey(key.id, key.prefix)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{rateLimitTiers[key.tier as keyof typeof rateLimitTiers]?.label || key.tier}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(key.lastUsed)}</TableCell>
                    <TableCell>{formatDate(key.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={key.isActive ? 'success' : 'warning'}>
                        {key.isActive ? 'Active' : 'Revoked'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 hover:bg-secondary rounded">
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-lg space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Profile Settings</h3>
            <p className="text-sm text-muted-foreground">Update your personal information</p>
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                defaultValue="Demo User"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue="demo@tokenspark.ai"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">User Type</label>
              <p className="text-sm text-muted-foreground">Individual</p>
            </div>
            <div className="pt-4">
              <Button variant="spark">Save Changes</Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h4 className="font-medium">Change Password</h4>
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="pt-4">
              <Button variant="outline">Update Password</Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-lg space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <p className="text-sm text-muted-foreground">Configure how you receive notifications</p>
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-4">
            {[
              { label: 'Email Notifications', description: 'Receive alerts via email', defaultChecked: true },
              { label: 'Low Balance Alert', description: 'Notify when balance drops below $10', defaultChecked: true },
              { label: 'Usage Reports', description: 'Weekly usage summary emails', defaultChecked: false },
              { label: 'Partner Commissions', description: 'Notify on new commission earnings', defaultChecked: true },
              { label: 'Security Alerts', description: 'Login and key usage notifications', defaultChecked: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
