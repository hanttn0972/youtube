import { Bell, X } from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import type { Page, SystemStatus, Notification } from '../../types';

interface AppShellProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  status: SystemStatus;
  notifications: Notification[];
  onMarkNotificationsRead: () => void;
  jobBadge?: number;
  children: React.ReactNode;
}

export function AppShell({
  currentPage,
  onNavigate,
  status,
  notifications,
  onMarkNotificationsRead,
  jobBadge,
  children,
}: AppShellProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden select-none"
      style={{ backgroundColor: '#0B0D10' }}
    >
      {/* Title bar */}
      <div
        className="h-8 flex items-center px-4 border-b shrink-0 relative z-10"
        style={{ backgroundColor: '#080A0D', borderColor: '#1A2030' }}
      >
        <span className="text-xs font-medium" style={{ color: '#8B93A1' }}>
          AutoYT Studio
        </span>
        <div className="ml-auto flex items-center gap-1">
          {/* Notification bell */}
          <button
            className="relative w-6 h-6 flex items-center justify-center rounded transition-colors"
            style={{ color: '#8B93A1' }}
            onClick={() => setShowNotifications((v) => !v)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F5F7FA';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8B93A1';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bell size={13} />
            {unreadCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#F04438' }}
              />
            )}
          </button>
          {/* Window controls */}
          {['#F5B544', '#32D583', '#F04438'].map((color, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full ml-1"
              style={{ backgroundColor: color, opacity: 0.8 }}
            />
          ))}
        </div>

        {/* Notification Panel */}
        {showNotifications && (
          <div
            className="absolute top-8 right-2 w-80 rounded-md border shadow-2xl z-50 overflow-hidden"
            style={{ backgroundColor: '#151920', borderColor: '#242932' }}
          >
            <div
              className="flex items-center justify-between px-3 py-2 border-b"
              style={{ borderColor: '#242932' }}
            >
              <span className="text-xs font-semibold" style={{ color: '#F5F7FA' }}>
                Notifications
              </span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    className="text-[10px]"
                    style={{ color: '#7C5CFC' }}
                    onClick={onMarkNotificationsRead}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ color: '#8B93A1' }}
                >
                  <X size={12} />
                </button>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs" style={{ color: '#8B93A1' }}>
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex gap-2.5 px-3 py-2.5 border-b last:border-0"
                    style={{
                      borderColor: '#1E2530',
                      backgroundColor: n.read ? 'transparent' : 'rgba(124,92,252,0.04)',
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                      style={{
                        backgroundColor:
                          n.type === 'success'
                            ? '#32D583'
                            : n.type === 'error'
                            ? '#F04438'
                            : n.type === 'warning'
                            ? '#F5B544'
                            : '#7C5CFC',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium" style={{ color: '#F5F7FA' }}>
                          {n.title}
                        </span>
                        <span className="text-[10px] shrink-0" style={{ color: '#8B93A1' }}>
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: '#8B93A1' }}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} jobBadge={jobBadge} />
        <main className="flex-1 overflow-hidden" style={{ backgroundColor: '#0B0D10' }}>
          {children}
        </main>
      </div>

      <StatusBar status={status} />
    </div>
  );
}
