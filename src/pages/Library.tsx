import {
  CheckCircle2,
  Clock,
  Film,
  Layers,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  XCircle,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { JobDetailDrawer } from '../components/jobs/JobDetailDrawer';
import type { Episode, Job, Series } from '../types';

interface LibraryProps {
  series: Series[];
  jobs: Job[];
  onNewDubbing: () => void;
}

type LibraryTab = 'series' | 'videos' | 'audio' | 'subtitles' | 'assets';

const TABS: { id: LibraryTab; label: string }[] = [
  { id: 'series', label: 'Series' },
  { id: 'videos', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
  { id: 'subtitles', label: 'Subtitles' },
  { id: 'assets', label: 'Assets' },
];

export function Library({ series, jobs, onNewDubbing }: LibraryProps) {
  const [tab, setTab] = useState<LibraryTab>('series');
  const [search, setSearch] = useState('');
  const [expandedSeries, setExpandedSeries] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filtered = series.filter(
    (s) => !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header toolbar */}
      <div
        className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
        style={{ borderColor: '#242932' }}
      >
        <h1 className="text-sm font-semibold mr-1" style={{ color: '#F5F7FA' }}>
          Library
        </h1>

        {/* Tabs */}
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-md"
          style={{ backgroundColor: '#151920' }}
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="px-2.5 py-1 rounded text-[11px] font-medium transition-colors"
              style={{
                backgroundColor: tab === id ? '#242932' : 'transparent',
                color: tab === id ? '#F5F7FA' : '#8B93A1',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8B93A1' }} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 pr-3 py-1.5 rounded-md text-xs outline-none w-44"
            style={{ backgroundColor: '#151920', border: '1px solid #242932', color: '#F5F7FA' }}
          />
        </div>

        <button
          onClick={onNewDubbing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
          style={{ backgroundColor: '#7C5CFC', color: '#fff' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6B4EE8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C5CFC')}
        >
          <Plus size={13} />
          New Series
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        {tab === 'series' ? (
          <div className="space-y-3">
            {filtered.map((s) => (
              <SeriesCard
                key={s.id}
                series={s}
                jobs={jobs}
                expanded={expandedSeries === s.id}
                onToggle={() => setExpandedSeries(expandedSeries === s.id ? null : s.id)}
                onSelectJob={setSelectedJob}
              />
            ))}
            {filtered.length === 0 && (
              <EmptyState message="No series found" action="New Dubbing" onAction={onNewDubbing} />
            )}
          </div>
        ) : (
          <EmptyState
            message={`No ${tab} yet`}
            action={tab === 'videos' ? 'New Dubbing' : undefined}
            onAction={onNewDubbing}
          />
        )}
      </div>

      <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}

function SeriesCard({
  series, jobs, expanded, onToggle, onSelectJob,
}: {
  series: Series;
  jobs: Job[];
  expanded: boolean;
  onToggle: () => void;
  onSelectJob: (j: Job) => void;
}) {
  const seriesJobs = jobs.filter((j) => j.seriesId === series.id);

  return (
    <div
      className="rounded-md border overflow-hidden"
      style={{ backgroundColor: '#151920', borderColor: '#242932' }}
    >
      {/* Series header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
        onClick={onToggle}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <div
          className="w-8 h-8 rounded flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#1A2030' }}
        >
          <Layers size={14} style={{ color: '#7C5CFC' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: '#F5F7FA' }}>
              {series.name}
            </span>
            <span className="text-[10px]" style={{ color: '#8B93A1' }}>
              {series.sourceLanguage} → {series.targetLanguage}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <StatChip label="Total" value={series.episodeCount} />
            <StatChip label="Done" value={series.completedCount} color="#32D583" />
            {series.processingCount > 0 && (
              <StatChip label="Running" value={series.processingCount} color="#7C5CFC" />
            )}
            {series.failedCount > 0 && (
              <StatChip label="Failed" value={series.failedCount} color="#F04438" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[10px]" style={{ color: '#8B93A1' }}>
              {series.translationProvider}
            </p>
            <p className="text-[10px]" style={{ color: '#8B93A1' }}>
              {series.outputFormat}
            </p>
          </div>
          <MoreHorizontal size={14} style={{ color: '#8B93A1' }} />
        </div>
      </button>

      {/* Episodes table */}
      {expanded && (
        <div style={{ borderTop: '1px solid #1E2530' }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2530' }}>
                {['EP', 'Status', 'Progress', 'Duration', 'Size', 'Last Updated', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left font-medium"
                    style={{ color: '#8B93A1', backgroundColor: '#101318' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series.episodes.map((ep) => {
                const job = seriesJobs.find((j) => j.episodeId === ep.id);
                return (
                  <EpisodeRow
                    key={ep.id}
                    episode={ep}
                    onSelect={() => job && onSelectJob(job)}
                    hasJob={!!job}
                  />
                );
              })}
            </tbody>
          </table>
          <div
            className="flex items-center gap-2 px-4 py-2 border-t"
            style={{ borderColor: '#1E2530' }}
          >
            <button
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium"
              style={{ backgroundColor: '#7C5CFC', color: '#fff' }}
            >
              <Play size={11} />
              Run All
            </button>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium"
              style={{ backgroundColor: '#1A2030', color: '#C5CBD6', border: '1px solid #242932' }}
            >
              <Plus size={11} />
              Add Episodes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EpisodeRow({
  episode, onSelect, hasJob,
}: {
  episode: Episode;
  onSelect: () => void;
  hasJob: boolean;
}) {
  const statusMeta = {
    completed: { color: '#32D583', icon: <CheckCircle2 size={11} />, label: 'Completed' },
    running: { color: '#7C5CFC', icon: <Zap size={11} />, label: 'Running' },
    queued: { color: '#F5B544', icon: <Clock size={11} />, label: 'Queued' },
    failed: { color: '#F04438', icon: <XCircle size={11} />, label: 'Failed' },
    paused: { color: '#8B93A1', icon: <Clock size={11} />, label: 'Paused' },
  }[episode.status];

  return (
    <tr
      className="border-b transition-colors"
      style={{ borderColor: '#1A2030', cursor: hasJob ? 'pointer' : 'default' }}
      onClick={hasJob ? onSelect : undefined}
      onMouseEnter={(e) => {
        if (hasJob) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
      }}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <td className="px-4 py-2">
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
          style={{ backgroundColor: '#1A2030', color: '#8B93A1' }}
        >
          EP{String(episode.ep).padStart(2, '0')}
        </span>
      </td>
      <td className="px-4 py-2">
        <span
          className="flex items-center gap-1 text-[11px] w-fit px-1.5 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${statusMeta.color}18`, color: statusMeta.color }}
        >
          {statusMeta.icon}
          {statusMeta.label}
        </span>
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#242932' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${episode.progress}%`,
                backgroundColor: statusMeta.color,
              }}
            />
          </div>
          <span style={{ color: '#8B93A1' }}>{episode.progress}%</span>
        </div>
      </td>
      <td className="px-4 py-2" style={{ color: '#8B93A1' }}>
        {episode.duration}
      </td>
      <td className="px-4 py-2" style={{ color: '#8B93A1' }}>
        {episode.size}
      </td>
      <td className="px-4 py-2" style={{ color: '#8B93A1' }}>
        {new Date(episode.lastUpdated).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td className="px-4 py-2">
        {hasJob && (
          <span className="text-[10px]" style={{ color: '#7C5CFC' }}>
            View →
          </span>
        )}
      </td>
    </tr>
  );
}

function StatChip({
  label, value, color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <span className="text-[10px]" style={{ color: color ?? '#8B93A1' }}>
      <span className="font-semibold">{value}</span> {label}
    </span>
  );
}

function EmptyState({
  message, action, onAction,
}: {
  message: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Film size={32} style={{ color: '#242932' }} />
      <p className="text-sm" style={{ color: '#8B93A1' }}>
        {message}
      </p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded text-xs font-medium"
          style={{ backgroundColor: '#7C5CFC', color: '#fff' }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
