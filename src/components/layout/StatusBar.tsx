import { Circle, Zap, HardDrive, Cpu } from 'lucide-react';
import type { SystemStatus } from '../../types';

interface StatusBarProps {
  status: SystemStatus;
}

export function StatusBar({ status }: StatusBarProps) {
  const vramPct = Math.round((status.vram.used / status.vram.total) * 100);
  const diskPct = Math.round((status.diskUsage.used / status.diskUsage.total) * 100);

  return (
    <div
      className="h-7 flex items-center px-3 gap-0 text-[11px] border-t shrink-0"
      style={{ backgroundColor: '#0D1015', borderColor: '#1E2430', color: '#8B93A1' }}
    >
      {/* Backend */}
      <StatusSegment>
        <Circle
          size={6}
          className="fill-current"
          style={{ color: status.backendOnline ? '#32D583' : '#F04438' }}
        />
        <span style={{ color: status.backendOnline ? '#32D583' : '#F04438' }}>
          {status.backendOnline ? 'Backend Online' : 'Backend Offline'}
        </span>
        <span className="opacity-50">:{status.backendPort}</span>
        <Divider />
        <span>Uptime {status.uptime}</span>
      </StatusSegment>

      <Divider />

      {/* GPU */}
      <StatusSegment>
        <Cpu size={11} />
        <Circle
          size={6}
          className="fill-current"
          style={{ color: status.gpuOnline ? '#32D583' : '#F04438' }}
        />
        <span style={{ color: status.gpuOnline ? '#32D583' : '#F04438' }}>
          {status.gpuModel}
        </span>
        <span className="opacity-50">|</span>
        <span>{status.gpuUtilization}%</span>
        <span className="opacity-50">VRAM {status.vram.used.toFixed(1)}/{status.vram.total.toFixed(0)} GB</span>
        {vramPct > 80 && (
          <span style={{ color: '#F5B544' }}>({vramPct}%)</span>
        )}
      </StatusSegment>

      <Divider />

      {/* Jobs */}
      <StatusSegment>
        <Zap size={11} style={{ color: '#7C5CFC' }} />
        <span style={{ color: '#F5F7FA' }}>{status.runningJobs} Running</span>
        <span className="opacity-50">·</span>
        <span>{status.queuedJobs} Queued</span>
        {status.failedJobs > 0 && (
          <>
            <span className="opacity-50">·</span>
            <span style={{ color: '#F04438' }}>{status.failedJobs} Failed</span>
          </>
        )}
      </StatusSegment>

      <Divider />

      {/* Disk */}
      <StatusSegment>
        <HardDrive size={11} />
        <span>{status.diskUsage.used} GB / {status.diskUsage.total} GB</span>
        <div
          className="w-20 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: '#242932' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${diskPct}%`,
              backgroundColor: diskPct > 85 ? '#F04438' : diskPct > 70 ? '#F5B544' : '#32D583',
            }}
          />
        </div>
        <span className="opacity-50">{diskPct}%</span>
      </StatusSegment>

      <div className="ml-auto" />

      <span className="opacity-40">v1.0.0-alpha</span>
    </div>
  );
}

function StatusSegment({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-2">
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      className="w-px h-3 mx-1"
      style={{ backgroundColor: '#242932' }}
    />
  );
}
