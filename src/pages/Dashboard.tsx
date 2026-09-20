import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  HardDrive,
  Mic2,
  Plus,
  Server,
  XCircle,
  Zap,
} from 'lucide-react';
import type { SystemStatus, Job } from '../types';

interface DashboardProps {
  status: SystemStatus;
  runningJobs: Job[];
  onNavigate: (page: 'jobs' | 'dubbing') => void;
}

export function Dashboard({ status, runningJobs, onNavigate }: DashboardProps) {
  const vramPct = Math.round((status.vram.used / status.vram.total) * 100);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold" style={{ color: '#F5F7FA' }}>
            Dashboard
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#8B93A1' }}>
            System overview and active jobs
          </p>
        </div>
        <div className="flex gap-2">
          <ActionButton icon={<Mic2 size={13} />} label="New Dubbing" onClick={() => onNavigate('dubbing')} primary />
          <ActionButton icon={<Zap size={13} />} label="Open Jobs" onClick={() => onNavigate('jobs')} />
        </div>
      </div>

      {/* Status cards row */}
      <div className="grid grid-cols-4 gap-3">
        {/* Backend */}
        <StatCard
          icon={<Server size={14} />}
          title="Backend"
          value={status.backendOnline ? 'Online' : 'Offline'}
          valueColor={status.backendOnline ? '#32D583' : '#F04438'}
          sub={`Port ${status.backendPort} · Up ${status.uptime}`}
          dot={status.backendOnline ? 'green' : 'red'}
        />
        {/* GPU */}
        <StatCard
          icon={<Cpu size={14} />}
          title="Remote GPU"
          value={status.gpuOnline ? 'Connected' : 'Offline'}
          valueColor={status.gpuOnline ? '#32D583' : '#F04438'}
          sub={status.gpuModel}
          dot={status.gpuOnline ? 'green' : 'red'}
          extra={
            status.gpuOnline ? (
              <div className="mt-2 space-y-1">
                <MiniBar label="GPU" value={status.gpuUtilization} color="#7C5CFC" />
                <MiniBar label="VRAM" value={vramPct} color={vramPct > 80 ? '#F5B544' : '#7C5CFC'}
                  sub={`${status.vram.used.toFixed(1)}/${status.vram.total} GB`} />
              </div>
            ) : null
          }
        />
        {/* Jobs summary */}
        <div
          className="rounded-md border p-3"
          style={{ backgroundColor: '#151920', borderColor: '#242932' }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={13} style={{ color: '#7C5CFC' }} />
            <span className="text-xs font-medium" style={{ color: '#8B93A1' }}>Jobs</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <JobStat label="Running" value={status.runningJobs} color="#7C5CFC" />
            <JobStat label="Queued" value={status.queuedJobs} color="#F5B544" />
            <JobStat label="Completed" value={status.completedJobs} color="#32D583" />
            <JobStat label="Failed" value={status.failedJobs} color="#F04438" />
          </div>
        </div>
        {/* Disk */}
        <StatCard
          icon={<HardDrive size={14} />}
          title="Storage"
          value={`${status.diskUsage.used} GB`}
          sub={`of ${status.diskUsage.total} GB used`}
          extra={
            <div className="mt-2">
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: '#242932' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((status.diskUsage.used / status.diskUsage.total) * 100)}%`,
                    backgroundColor:
                      status.diskUsage.used / status.diskUsage.total > 0.85
                        ? '#F04438'
                        : status.diskUsage.used / status.diskUsage.total > 0.7
                        ? '#F5B544'
                        : '#32D583',
                  }}
                />
              </div>
              <span className="text-[10px] mt-1 block" style={{ color: '#8B93A1' }}>
                {Math.round((status.diskUsage.used / status.diskUsage.total) * 100)}% used
              </span>
            </div>
          }
        />
      </div>

      {/* Running jobs */}
      <div>
        <SectionHeader title="Active Jobs" count={runningJobs.filter(j => j.status === 'running').length} />
        <div className="space-y-2 mt-2">
          {runningJobs
            .filter((j) => j.status === 'running')
            .map((job) => (
              <RunningJobRow key={job.id} job={job} onClick={() => onNavigate('jobs')} />
            ))}
          {runningJobs.filter((j) => j.status === 'running').length === 0 && (
            <EmptyRow icon={<Activity size={14} />} message="No jobs currently running" />
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <SectionHeader title="Recent Activity" />
        <div
          className="mt-2 rounded-md border overflow-hidden"
          style={{ borderColor: '#242932' }}
        >
          {[
            { icon: <CheckCircle2 size={13} />, color: '#32D583', text: 'Anime Highlights EP02 — completed successfully', time: '41m ago' },
            { icon: <AlertTriangle size={13} />, color: '#F04438', text: 'Anime Highlights EP04 — failed at TTS (CUDA OOM)', time: '28m ago' },
            { icon: <Clock size={13} />, color: '#F5B544', text: 'Tech Review: iPhone 17 — added to queue', time: '5m ago' },
            { icon: <CheckCircle2 size={13} />, color: '#32D583', text: 'Tech Review: MacBook M4 — completed successfully', time: '1h 20m ago' },
            { icon: <XCircle size={13} />, color: '#8B93A1', text: 'Cooking Channel EP02, EP03 — queued', time: 'Yesterday' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 border-b last:border-0"
              style={{ borderColor: '#1E2530' }}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
              <span className="flex-1 text-xs" style={{ color: '#C5CBD6' }}>
                {item.text}
              </span>
              <span className="text-[10px] shrink-0" style={{ color: '#8B93A1' }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon, title, value, valueColor, sub, dot, extra,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  valueColor?: string;
  sub?: string;
  dot?: 'green' | 'red';
  extra?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-md border p-3"
      style={{ backgroundColor: '#151920', borderColor: '#242932' }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span style={{ color: '#8B93A1' }}>{icon}</span>
        <span className="text-xs font-medium" style={{ color: '#8B93A1' }}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {dot && (
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: dot === 'green' ? '#32D583' : '#F04438' }}
          />
        )}
        <span className="text-sm font-semibold" style={{ color: valueColor ?? '#F5F7FA' }}>
          {value}
        </span>
      </div>
      {sub && (
        <p className="text-[11px] mt-0.5" style={{ color: '#8B93A1' }}>
          {sub}
        </p>
      )}
      {extra}
    </div>
  );
}

function MiniBar({
  label, value, color, sub,
}: {
  label: string;
  value: number;
  color: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px]" style={{ color: '#8B93A1' }}>{label}</span>
        <span className="text-[10px]" style={{ color: '#8B93A1' }}>{sub ?? `${value}%`}</span>
      </div>
      <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#242932' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function JobStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold" style={{ color }}>
        {value}
      </span>
      <span className="text-[11px]" style={{ color: '#8B93A1' }}>
        {label}
      </span>
    </div>
  );
}

function RunningJobRow({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <button
      className="w-full text-left rounded-md border px-3 py-2.5 transition-colors"
      style={{ backgroundColor: '#151920', borderColor: '#242932' }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#7C5CFC';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#242932';
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#32D583' }} />
          <span className="text-xs font-medium" style={{ color: '#F5F7FA' }}>
            {job.seriesName}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ backgroundColor: '#242932', color: '#8B93A1' }}
          >
            EP{String(job.ep).padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px]" style={{ color: '#8B93A1' }}>
            {job.currentStage.toUpperCase().replace('_', ' ')}
          </span>
          <span className="text-xs font-semibold" style={{ color: '#7C5CFC' }}>
            {job.progress}%
          </span>
          <span className="text-[10px]" style={{ color: '#8B93A1' }}>
            {job.elapsed}
          </span>
        </div>
      </div>
      <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#242932' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${job.progress}%`,
            background: 'linear-gradient(90deg, #7C5CFC, #9F7AEA)',
          }}
        />
      </div>
    </button>
  );
}

function ActionButton({
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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors"
      style={{
        backgroundColor: primary ? '#7C5CFC' : '#151920',
        color: primary ? '#fff' : '#C5CBD6',
        border: primary ? 'none' : '1px solid #242932',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = primary ? '#6B4EE8' : '#1A2030';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = primary ? '#7C5CFC' : '#151920';
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold" style={{ color: '#F5F7FA' }}>
        {title}
      </span>
      {count !== undefined && (
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: 'rgba(124,92,252,0.15)', color: '#7C5CFC' }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyRow({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-3 rounded-md border"
      style={{ borderColor: '#242932', borderStyle: 'dashed', color: '#8B93A1' }}
    >
      {icon}
      <span className="text-xs">{message}</span>
    </div>
  );
}
