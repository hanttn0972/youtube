import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DubbingWizard } from './components/dubbing/DubbingWizard';
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { Library } from './pages/Library';
import { Publisher } from './pages/Publisher';
import { Recreate } from './pages/Recreate';
import { Settings } from './pages/Settings';
import { mockJobs, mockNotifications, mockPublishQueue, mockSeries, mockSystemStatus } from './data/mock';
import type { Notification, Page } from './types';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [showDubbingWizard, setShowDubbingWizard] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));

  const runningJobCount = mockJobs.filter((j) => j.status === 'running' || j.status === 'queued').length;

  const navigateTo = (target: Page) => {
    setPage(target);
  };

  const openDubbing = () => setShowDubbingWizard(true);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            status={mockSystemStatus}
            runningJobs={mockJobs}
            onNavigate={(p) => {
              if (p === 'dubbing') {
                openDubbing();
              } else {
                navigateTo(p);
              }
            }}
          />
        );
      case 'dubbing':
        return (
          <DubbingLanding onOpen={openDubbing} />
        );
      case 'jobs':
        return <Jobs jobs={mockJobs} />;
      case 'library':
        return (
          <Library
            series={mockSeries}
            jobs={mockJobs}
            onNewDubbing={openDubbing}
          />
        );
      case 'publisher':
        return <Publisher queue={mockPublishQueue} />;
      case 'recreate':
        return <Recreate />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <>
      <AppShell
        currentPage={page}
        onNavigate={(p) => {
          if (p === 'dubbing') {
            openDubbing();
          } else {
            navigateTo(p);
          }
        }}
        status={mockSystemStatus}
        notifications={notifications}
        onMarkNotificationsRead={markAllRead}
        jobBadge={runningJobCount}
      >
        {renderPage()}
      </AppShell>

      {showDubbingWizard && (
        <DubbingWizard
          onClose={() => setShowDubbingWizard(false)}
          onStart={() => {
            setShowDubbingWizard(false);
            navigateTo('jobs');
          }}
        />
      )}
    </>
  );
}

function DubbingLanding({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5}>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-base font-semibold" style={{ color: '#F5F7FA' }}>
          Dubbing Studio
        </h2>
        <p className="text-xs mt-1 max-w-xs" style={{ color: '#8B93A1' }}>
          Create a new dubbing job to translate and voice-over video content in batch or series mode.
        </p>
      </div>
      <button
        onClick={onOpen}
        className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold"
        style={{ backgroundColor: '#7C5CFC', color: '#fff' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6B4EE8')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C5CFC')}
      >
        New Dubbing Job
      </button>
    </div>
  );
}
