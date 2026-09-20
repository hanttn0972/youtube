import { X, CheckCircle2, Loader2, Circle, AlertCircle, SkipForward, ChevronDown, ChevronRight, RefreshCw, Terminal, Clock } from 'lucide-react';
import { useState } from 'react';
import type { Job, Stage, StageStatus } from '../../types';

interface JobDetailDrawerProps {
  job: Job | null;
  onClose: () => void;
  onRetry?: (jobId: string) => void;
}

export function JobDetailDrawer({ job, onClose, onRetry }: JobDetailDrawerProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  if (!job) return null;

  const statusColors: Record<string, string> = {
    running: '#7C5CFC',
    queued: '#F5B544',
    completed: '#32D583',
    failed: '#F04438',
    paused: '#8B93A1',
  };

  const statusLabels: Record<string, string> = {
    running: 'Running',
    queued: 'Queued',
    completed: 'Completed',
    failed: 'Failed',
    paused: 'Paused',
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-30"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-[420px] z-40 flex flex-col border-l overflow-hidden"
        style={{ backgroundColor: '#101318', borderColor: '#242932' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: '#242932' }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold truncate" style={{ color: '#F5F7FA' }}>
                {job.episodeName}
              </span>
              <span
                className="shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: `${statusColors[job.status]}22`,
                  color: statusColors[job.status],
                }}
              >
                {statusLabels[job.status]}
              </span>
            </div>
            <p className="text-[11px] mt-0.5 truncate" style={{ color: '#8B93A1' }}>
              {job.seriesName} · EP{String(job.ep).padStart(2, '0')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-1 rounded transition-colors"
            style={{ color: '#8B93A1' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F5F7FA';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8B93A1';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Meta row */}
        <div
          className="grid grid-cols-3 border-b shrink-0"
          style={{ borderColor: '#242932' }}
        >
          {[
            { label: 'Progress', value: `${job.progress}%` },
            { label: 'Started', value: job.startedAt ? formatTime(job.startedAt) : '—' },
            { label: 'Elapsed', value: job.elapsed ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="px-4 py-2.5">
              <p className="text-[10px]" style={{ color: '#8B93A1' }}>
                {label}
              </p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: '#F5F7FA' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-4 py-2 border-b shrink-0" style={{ borderColor: '#1E2530' }}>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#242932' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${job.progress}%`,
                background:
                  job.status === 'failed'
                    ? '#F04438'
                    : job.status === 'completed'
                    ? '#32D583'
                    : 'linear-gradient(90deg, #7C5CFC, #9F7AEA)',
              }}
            />
          </div>
        </div>

        {/* Stage timeline */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold tracking-wider uppercase mb-2" style={{ color: '#8B93A1' }}>
            Pipeline Stages
          </p>
          {job.stages.map((stage) => (
            <StageRow
              key={stage.id}
              stage={stage}
              expanded={expandedStage === stage.id}
              onToggle={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
            />
          ))}
        </div>

        {/* Actions */}
        {(job.status === 'failed' || job.status === 'running') && (
          <div
            className="px-4 py-3 border-t shrink-0 space-y-2"
            style={{ borderColor: '#242932' }}
          >
            {job.status === 'failed' && (
              <>
                <div
                  className="flex items-start gap-2 p-2.5 rounded-md"
                  style={{ backgroundColor: 'rgba(240,68,56,0.08)', border: '1px solid rgba(240,68,56,0.2)' }}
                >
                  <AlertCircle size={13} className="mt-0.5 shrink-0" style={{ color: '#F04438' }} />
                  <p className="text-[11px]" style={{ color: '#F5B4B0' }}>
                    {job.stages.find((s) => s.status === 'failed')?.errorMessage ?? 'Unknown error'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <DrawerButton
                    icon={<RefreshCw size={12} />}
                    label="Retry Stage"
                    onClick={() => onRetry?.(job.id)}
                    primary
                  />
                  <DrawerButton
                    icon={<RefreshCw size={12} />}
                    label="Retry From Here"
                    onClick={() => onRetry?.(job.id)}
                  />
                  <DrawerButton
                    icon={<Terminal size={12} />}
                    label="View Logs"
                    onClick={() => setExpandedStage(job.stages.find((s) => s.status === 'failed')?.id ?? null)}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function StageRow({
  stage, expanded, onToggle,
}: {
  stage: Stage;
  expanded: boolean;
  onToggle: () => void;
}) {
  const icons: Record<StageStatus, React.ReactNode> = {
    completed: <CheckCircle2 size={13} style={{ color: '#32D583' }} />,
    running: <Loader2 size={13} className="animate-spin" style={{ color: '#7C5CFC' }} />,
    failed: <AlertCircle size={13} style={{ color: '#F04438' }} />,
    pending: <Circle size={13} style={{ color: '#4A5568' }} />,
    skipped: <SkipForward size={13} style={{ color: '#8B93A1' }} />,
  };

  const isInteractive = stage.logs && stage.logs.length > 0;

  return (
    <div>
      <button
        className="w-full flex items-center gap-2.5 py-2 px-2 rounded text-left transition-colors"
        onClick={isInteractive ? onToggle : undefined}
        style={{
          cursor: isInteractive ? 'pointer' : 'default',
          backgroundColor: expanded ? 'rgba(255,255,255,0.04)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (isInteractive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
        }}
        onMouseLeave={(e) => {
          if (!expanded) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div className="shrink-0">{icons[stage.status]}</div>
        <span
          className="flex-1 text-xs font-medium"
          style={{
            color:
              stage.status === 'completed'
                ? '#F5F7FA'
                : stage.status === 'running'
                ? '#F5F7FA'
                : stage.status === 'failed'
                ? '#F04438'
                : '#4A5568',
          }}
        >
          {stage.label}
        </span>
        <span className="text-[10px]" style={{ color: '#8B93A1' }}>
          {stage.engine}
        </span>
        {stage.duration && (
          <span className="flex items-center gap-1 text-[10px]" style={{ color: '#8B93A1' }}>
            <Clock size={10} />
            {stage.duration}
          </span>
        )}
        {isInteractive && (
          <span style={{ color: '#4A5568' }}>
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        )}
        <span
          className="text-[9px] px-1 rounded"
          style={{
            backgroundColor: stage.target === 'remote' ? 'rgba(124,92,252,0.15)' : 'rgba(255,255,255,0.06)',
            color: stage.target === 'remote' ? '#7C5CFC' : '#8B93A1',
          }}
        >
          {stage.target.toUpperCase()}
        </span>
      </button>

      {/* Connector line */}
      <div className="flex">
        <div className="w-6 flex justify-center">
          <div className="w-px h-1" style={{ backgroundColor: '#242932' }} />
        </div>
      </div>

      {/* Logs panel */}
      {expanded && stage.logs && stage.logs.length > 0 && (
        <div
          className="mx-2 mb-1 rounded-md p-2 overflow-x-auto"
          style={{ backgroundColor: '#0B0D10', border: '1px solid #242932' }}
        >
          {stage.logs.map((line, i) => (
            <p key={i} className="text-[11px] font-mono leading-relaxed" style={{ color: '#8B93A1' }}>
              {line}
            </p>
          ))}
          {stage.errorMessage && (
            <p className="text-[11px] font-mono mt-1" style={{ color: '#F04438' }}>
              [ERROR] {stage.errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DrawerButton({
  icon, label, onClick, primary,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-medium flex-1 justify-center transition-colors"
      style={{
        backgroundColor: primary ? '#7C5CFC' : '#1A2030',
        color: primary ? '#fff' : '#C5CBD6',
        border: primary ? 'none' : '1px solid #242932',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = primary ? '#6B4EE8' : '#242932';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = primary ? '#7C5CFC' : '#1A2030';
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}
