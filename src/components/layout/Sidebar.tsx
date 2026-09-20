import { LayoutDashboard, Mic2, Sparkles, Send, Library, Zap, Settings, ChevronRight, type LucideIcon } from 'lucide-react';
import type { Page } from '../../types';

interface NavItem {
  id: Page;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'dubbing', label: 'Dubbing', icon: Mic2 },
  { id: 'recreate', label: 'Re-create', icon: Sparkles },
  { id: 'publisher', label: 'Publisher', icon: Send },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'jobs', label: 'Jobs', icon: Zap },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  jobBadge?: number;
}

export function Sidebar({ currentPage, onNavigate, jobBadge }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full w-[188px] shrink-0 border-r"
      style={{ backgroundColor: '#101318', borderColor: '#242932' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4 py-4 border-b"
        style={{ borderColor: '#242932' }}
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C5CFC 0%, #5B3FD4 100%)' }}
        >
          <Zap size={14} className="text-white" />
        </div>
        <div>
          <div className="font-semibold text-xs leading-tight" style={{ color: '#F5F7FA' }}>
            AutoYT
          </div>
          <div className="text-[10px] leading-tight font-medium tracking-widest uppercase" style={{ color: '#8B93A1' }}>
            Studio
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin">
        <div className="px-2 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = currentPage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-colors group relative"
                style={{
                  backgroundColor: active ? 'rgba(124, 92, 252, 0.15)' : 'transparent',
                  color: active ? '#7C5CFC' : '#8B93A1',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#F5F7FA';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#8B93A1';
                  }
                }}
              >
                {active && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
                    style={{ backgroundColor: '#7C5CFC' }}
                  />
                )}
                <Icon size={14} />
                <span className="text-xs font-medium flex-1">{label}</span>
                {id === 'jobs' && jobBadge !== undefined && jobBadge > 0 && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(124, 92, 252, 0.2)', color: '#7C5CFC' }}
                  >
                    {jobBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="border-t py-2 px-2" style={{ borderColor: '#242932' }}>
        <button
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-colors"
          style={{
            backgroundColor: currentPage === 'settings' ? 'rgba(124, 92, 252, 0.15)' : 'transparent',
            color: currentPage === 'settings' ? '#7C5CFC' : '#8B93A1',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 'settings') {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = '#F5F7FA';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 'settings') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8B93A1';
            }
          }}
        >
          <Settings size={14} />
          <span className="text-xs font-medium flex-1">Settings</span>
          <ChevronRight size={12} />
        </button>
      </div>
    </aside>
  );
}
