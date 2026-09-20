import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Facebook,
  Instagram,
  List,
  Loader2,
  Plus,
  Send,
  XCircle,
  Youtube,
} from 'lucide-react';
import { useState } from 'react';
import type { PublishItem } from '../types';

interface PublisherProps {
  queue: PublishItem[];
}

type ViewMode = 'list' | 'calendar';

const STATUS_META = {
  scheduled: { color: '#F5B544', label: 'Scheduled', icon: <Clock size={11} /> },
  publishing: { color: '#7C5CFC', label: 'Publishing', icon: <Loader2 size={11} className="animate-spin" /> },
  published: { color: '#32D583', label: 'Published', icon: <CheckCircle2 size={11} /> },
  failed: { color: '#F04438', label: 'Failed', icon: <XCircle size={11} /> },
  draft: { color: '#8B93A1', label: 'Draft', icon: <Edit2 size={11} /> },
};

const PLATFORM_META = {
  youtube: { icon: <Youtube size={14} />, color: '#FF0000', label: 'YouTube' },
  tiktok: { icon: <Send size={14} />, color: '#00F2EA', label: 'TikTok' },
  facebook: { icon: <Facebook size={14} />, color: '#1877F2', label: 'Facebook' },
  instagram: { icon: <Instagram size={14} />, color: '#E1306C', label: 'Instagram' },
};

const CALENDAR_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Publisher({ queue }: PublisherProps) {
  const [view, setView] = useState<ViewMode>('list');
  const [selectedItem, setSelectedItem] = useState<PublishItem | null>(null);
  const [platform, setPlatform] = useState<string>('all');

  const platforms = ['all', 'youtube', 'tiktok', 'facebook', 'instagram'] as const;
  const filtered = queue.filter((q) => platform === 'all' || q.platform === platform);

  const calendarItems: Record<number, PublishItem[]> = {};
  queue
    .filter((q) => q.scheduledAt)
    .forEach((q) => {
      const day = new Date(q.scheduledAt!).getDate();
      calendarItems[day] = [...(calendarItems[day] ?? []), q];
    });

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div
          className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
          style={{ borderColor: '#242932' }}
        >
          <h1 className="text-sm font-semibold mr-1" style={{ color: '#F5F7FA' }}>
            Publisher
          </h1>

          {/* Platform filter */}
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-md"
            style={{ backgroundColor: '#151920' }}
          >
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors capitalize"
                style={{
                  backgroundColor: platform === p ? '#242932' : 'transparent',
                  color: platform === p ? '#F5F7FA' : '#8B93A1',
                }}
              >
                {p !== 'all' && (
                  <span style={{ color: PLATFORM_META[p as keyof typeof PLATFORM_META].color }}>
                    {PLATFORM_META[p as keyof typeof PLATFORM_META].icon}
                  </span>
                )}
                {p === 'all' ? 'All' : PLATFORM_META[p as keyof typeof PLATFORM_META].label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <div
            className="flex items-center gap-0.5 p-0.5 rounded-md"
            style={{ backgroundColor: '#151920' }}
          >
            <button
              onClick={() => setView('list')}
              className="p-1.5 rounded"
              style={{ backgroundColor: view === 'list' ? '#242932' : 'transparent', color: view === 'list' ? '#F5F7FA' : '#8B93A1' }}
            >
              <List size={13} />
            </button>
            <button
              onClick={() => setView('calendar')}
              className="p-1.5 rounded"
              style={{ backgroundColor: view === 'calendar' ? '#242932' : 'transparent', color: view === 'calendar' ? '#F5F7FA' : '#8B93A1' }}
            >
              <Calendar size={13} />
            </button>
          </div>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
            style={{ backgroundColor: '#7C5CFC', color: '#fff' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6B4EE8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C5CFC')}
          >
            <Plus size={13} />
            Schedule Post
          </button>
        </div>

        {/* Content */}
        {view === 'list' ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10" style={{ backgroundColor: '#0F1318' }}>
                <tr style={{ borderBottom: '1px solid #242932' }}>
                  {['Video', 'Platform', 'Schedule', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-medium" style={{ color: '#8B93A1' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const pm = PLATFORM_META[item.platform];
                  const sm = STATUS_META[item.status];
                  return (
                    <tr
                      key={item.id}
                      className="border-b cursor-pointer transition-colors"
                      style={{ borderColor: '#1A2030' }}
                      onClick={() => setSelectedItem(item)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.025)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td className="px-4 py-2.5">
                        <div>
                          <p className="font-medium" style={{ color: '#F5F7FA' }}>{item.videoTitle}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: '#8B93A1' }}>{item.seriesName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="flex items-center gap-1.5 text-[11px] font-medium"
                          style={{ color: pm.color }}
                        >
                          {pm.icon}
                          {pm.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5" style={{ color: '#8B93A1' }}>
                        {item.scheduledAt
                          ? new Date(item.scheduledAt).toLocaleString('en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            })
                          : item.publishedAt
                          ? new Date(item.publishedAt).toLocaleString('en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="flex items-center gap-1 text-[11px] font-medium w-fit px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${sm.color}18`, color: sm.color }}
                        >
                          {sm.icon}
                          {sm.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <button className="text-[11px]" style={{ color: '#7C5CFC' }}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <CalendarView calendarItems={calendarItems} />
        )}
      </div>

      {/* Metadata editor panel */}
      {selectedItem && (
        <MetaPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

function CalendarView({ calendarItems }: { calendarItems: Record<number, PublishItem[]> }) {
  const today = 20;
  const daysInMonth = 30;
  const firstDayOffset = 0;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: '#F5F7FA' }}>September 2026</h2>
      </div>
      <div className="grid grid-cols-7 gap-px" style={{ backgroundColor: '#242932' }}>
        {CALENDAR_DAYS.map((d) => (
          <div
            key={d}
            className="py-1.5 text-center text-[11px] font-medium"
            style={{ backgroundColor: '#151920', color: '#8B93A1' }}
          >
            {d}
          </div>
        ))}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} style={{ backgroundColor: '#0B0D10' }} />
        ))}
        {days.map((day) => {
          const items = calendarItems[day] ?? [];
          const isToday = day === today;
          return (
            <div
              key={day}
              className="min-h-[80px] p-1.5"
              style={{
                backgroundColor: isToday ? '#1A2030' : '#151920',
                border: isToday ? '1px solid #7C5CFC' : 'none',
              }}
            >
              <span
                className="text-[11px] font-medium"
                style={{ color: isToday ? '#7C5CFC' : '#8B93A1' }}
              >
                {day}
              </span>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="mt-1 text-[10px] px-1 py-0.5 rounded truncate"
                  style={{
                    backgroundColor: `${PLATFORM_META[item.platform].color}22`,
                    color: PLATFORM_META[item.platform].color,
                  }}
                >
                  {item.videoTitle}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetaPanel({ item, onClose }: { item: PublishItem; onClose: () => void }) {
  const pm = PLATFORM_META[item.platform];
  return (
    <div
      className="w-72 border-l flex flex-col overflow-hidden shrink-0"
      style={{ backgroundColor: '#101318', borderColor: '#242932' }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: '#242932' }}
      >
        <span className="text-xs font-semibold" style={{ color: '#F5F7FA' }}>
          Edit Post
        </span>
        <button onClick={onClose} style={{ color: '#8B93A1' }}>
          <XCircle size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        <Field label="Platform">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: pm.color }}>
            {pm.icon}
            {pm.label}
          </span>
        </Field>

        <Field label="Title">
          <input
            defaultValue={item.videoTitle}
            className="w-full px-2 py-1.5 rounded text-xs outline-none"
            style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}
          />
        </Field>

        <Field label="Description">
          <textarea
            defaultValue="Watch in Vietnamese dubbing! Subscribe for more content."
            rows={4}
            className="w-full px-2 py-1.5 rounded text-xs outline-none resize-none scrollbar-thin"
            style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}
          />
        </Field>

        <Field label="Tags">
          <input
            defaultValue="anime, vietsub, dubbing"
            className="w-full px-2 py-1.5 rounded text-xs outline-none"
            style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}
          />
        </Field>

        <Field label="Schedule">
          <input
            type="datetime-local"
            defaultValue={item.scheduledAt?.slice(0, 16) ?? ''}
            className="w-full px-2 py-1.5 rounded text-xs outline-none"
            style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA', colorScheme: 'dark' }}
          />
        </Field>
      </div>

      <div className="p-4 border-t" style={{ borderColor: '#242932' }}>
        <button
          className="w-full py-2 rounded text-xs font-semibold"
          style={{ backgroundColor: '#7C5CFC', color: '#fff' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6B4EE8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C5CFC')}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold tracking-wider uppercase block mb-1" style={{ color: '#8B93A1' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
