import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { useLocale } from '@/hooks/use-locale';
import { setLocale } from '@/i18n';
import { cn } from '@/lib/utils';

// Locale list for dropdown
const localeList: Array<{ code: string; native: string; label: string }> = [
  { code: 'zh', native: '简体中文', label: 'Chinese' },
  { code: 'zh-TW', native: '繁體中文', label: 'Chinese (TW)' },
  { code: 'en', native: 'English', label: 'English' },
  { code: 'ja', native: '日本語', label: 'Japanese' },
  { code: 'ko', native: '한국어', label: 'Korean' },
  { code: 'ru', native: 'Русский', label: 'Russian' },
  { code: 'es', native: 'Español', label: 'Spanish' },
  { code: 'fr', native: 'Français', label: 'French' },
  { code: 'de', native: 'Deutsch', label: 'German' },
  { code: 'ar', native: 'العربية', label: 'Arabic' },
  { code: 'pt', native: 'Português', label: 'Portuguese' },
  { code: 'hi', native: 'हिन्दी', label: 'Hindi' },
];

export function TopBar() {
  const navigate = useNavigate();
  const { openSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const { locale, changeLocale } = useLocale();
  const [showLocaleDropdown, setShowLocaleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLocaleChange = (code: string) => {
    setLocale(code as any);
    changeLocale(code as any);
    setShowLocaleDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-secondary"
        onClick={openSidebar}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Locale selector */}
        <div className="relative">
          <button
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            onClick={() => setShowLocaleDropdown(!showLocaleDropdown)}
          >
            {localeList.find(l => l.code === locale)?.native || '简体中文'}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showLocaleDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover shadow-card overflow-hidden z-50">
              <div className="max-h-64 overflow-y-auto py-1">
                {localeList.map((item) => (
                  <button
                    key={item.code}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                      locale === item.code && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleLocaleChange(item.code)}
                  >
                    {item.native}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-md hover:bg-secondary/50 transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-secondary/50 transition-colors"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden md:inline text-sm font-medium">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
          </button>
          {showUserDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover shadow-card overflow-hidden z-50">
              <div className="py-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                  onClick={() => {
                    navigate('/dashboard/settings');
                    setShowUserDropdown(false);
                  }}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <div className="border-t border-border" />
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
