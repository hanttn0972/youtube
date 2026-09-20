import { Search, Zap, Clock, CheckCircle2, XCircle, PauseCircle, Filter } from 'lucide-react';
import { useState } from 'react';
import { JobDetailDrawer } from '../components/jobs/JobDetailDrawer';
import type { Job, JobStatus } from '../types';

interface JobsProps {
  jobs: Job[];
}

type Filter = 'all' | JobStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'running', label: 'Running' },
  { id: 'queued', label: 'Queued' },
  { id: 'failed', label: 'Failed' },
  { id: 'completed', label: 'Completed' },
  { id: 'paused', label: 'Paused' },
];

const STATUS_META: Record<
  JobStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  running: { label: 'Running', color: '#7C5CFC', icon: <Zap size={11} /> },
  queued: { label: 'Queued', color: '#F5B544', icon: <Clock size={11} /> },
  completed: { label: 'Completed', color: '#32D583', icon: <CheckCircle2 size={11} /> },
  failed: { label: 'Failed', color: '#F04438', icon: <XCircle size={11} /> },
  paused: { label: 'Paused', color: '#8B93A1', icon: <PauseCircle size={11} /> },
};

export function Jobs({ jobs }: JobsProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filtered = jobs.filter((j) => {
    if (filter !== 'all' && j.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        j.seriesName.toLowerCase().includes(q) ||
        j.episodeName.toLowerCase().includes(q) ||
        j.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts: Record<string, number> = { all: jobs.length };
  jobs.forEach((j) => {
    counts[j.status] = (counts[j.status] ?? 0) + 1;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div
        className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
        style={{ borderColor: '#242932' }}
      >
        <h1 className="text-sm font-semibold mr-1" style={{ color: '#F5F7FA' }}>
          Jobs
        </h1>

        {/* Filter tabs */}
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-md"
          style={{ backgroundColor: '#151920' }}
        >
          {FILTERS.map(({ id, label }) => {
            const active = filter === id;
            const count = counts[id] ?? 0;
            if (id !== 'all' && count === 0) return null;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors"
                style={{
                  backgroundColor: active ? '#242932' : 'transparent',
                  color: active ? '#F5F7FA' : '#8B93A1',
                }}
              >
                {label}
                {count > 0 && (
                  <span
                    className="text-[9px] px-1 rounded-full"
                    style={{
                      backgroundColor: active ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.06)',
                      color: active ? '#7C5CFC' : '#8B93A1',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: '#8B93A1' }}
          />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 pr-3 py-1.5 rounded-md text-xs outline-none w-48"
            style={{
              backgroundColor: '#151920',
              border: '1px solid #242932',
              color: '#F5F7FA',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10" style={{ backgroundColor: '#0F1318' }}>
            <tr style={{ borderBottom: '1px solid #242932' }}>
              {['Series', 'Episode', 'Stage', 'Progress', 'Status', 'Started', 'Duration'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left font-medium"
                    style={{ color: '#8B93A1' }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12"
                  style={{ color: '#8B93A1' }}
                >
                  No jobs match current filter
                </td>
              </tr>
            ) : (
              filtered.map((job) => {
                const meta = STATUS_META[job.status];
                return (
                  <tr
                    key={job.id}
                    className="border-b cursor-pointer transition-colors"
                    style={{ borderColor: '#1A2030' }}
                    onClick={() => setSelectedJob(job)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.025)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="px-4 py-2.5">
                      <span style={{ color: '#F5F7FA' }}>{job.seriesName}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: '#1A2030', color: '#8B93A1' }}
                        >
                          EP{String(job.ep).padStart(2, '0')}
                        </span>
                        <span
                          className="max-w-[140px] truncate"
                          style={{ color: '#C5CBD6' }}
                        >
                          {job.episodeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span style={{ color: '#8B93A1' }}>
                        {job.currentStage.toUpperCase().replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-20 h-1.5 rounded-full overflow-hidden"
                          style={{ backgroundColor: '#242932' }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${job.progress}%`,
                              backgroundColor:
                                job.status === 'failed'
                                  ? '#F04438'
                                  : job.status === 'completed'
                                  ? '#32D583'
                                  : '#7C5CFC',
                            }}
                          />
                        </div>
                        <span style={{ color: '#8B93A1' }}>{job.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="flex items-center gap-1 text-[11px] font-medium w-fit px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${meta.color}18`,
                          color: meta.color,
                        }}
                      >
                        {meta.icon}
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5" style={{ color: '#8B93A1' }}>
                      {job.startedAt ? formatTime(job.startedAt) : '—'}
                    </td>
                    <td className="px-4 py-2.5" style={{ color: '#8B93A1' }}>
                      {job.elapsed ?? '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <JobDetailDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}
