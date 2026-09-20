import {
  Check,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  HardDrive,
  Loader2,
  Monitor,
  Server,
  Settings2,
  Trash2,
  Wifi,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { mockModels } from '../data/mock';
import type { AIModel } from '../types';

type SettingsTab = 'general' | 'processing' | 'ai_providers' | 'remote_gpu' | 'models' | 'storage';

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General', icon: <Settings2 size={13} /> },
  { id: 'processing', label: 'Processing', icon: <Server size={13} /> },
  { id: 'ai_providers', label: 'AI Providers', icon: <Monitor size={13} /> },
  { id: 'remote_gpu', label: 'Remote GPU', icon: <Wifi size={13} /> },
  { id: 'models', label: 'Models', icon: <Download size={13} /> },
  { id: 'storage', label: 'Storage', icon: <HardDrive size={13} /> },
];

type ConnectionState = 'idle' | 'testing' | 'done';
const GPU_CHECKS = [
  { key: 'ssh', label: 'SSH Connection', ok: true },
  { key: 'gpu', label: 'NVIDIA GPU', ok: true },
  { key: 'cuda', label: 'CUDA 12.x', ok: true },
  { key: 'python', label: 'Python 3.10+', ok: true },
  { key: 'whisper', label: 'Whisper', ok: true },
  { key: 'demucs', label: 'Demucs', ok: false },
];

export function Settings() {
  const [tab, setTab] = useState<SettingsTab>('general');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [models, setModels] = useState<AIModel[]>(mockModels);

  const toggleKey = (key: string) => setShowKeys((s) => ({ ...s, [key]: !s[key] }));

  const testConnection = () => {
    setConnectionState('testing');
    setTimeout(() => setConnectionState('done'), 1800);
  };

  const downloadModel = (id: string) => {
    setModels((ms) =>
      ms.map((m) =>
        m.id === id ? { ...m, downloading: true, downloadProgress: 0 } : m
      )
    );
    const interval = setInterval(() => {
      setModels((ms) => {
        const updated = ms.map((m) => {
          if (m.id === id && m.downloading) {
            const next = (m.downloadProgress ?? 0) + 8;
            if (next >= 100) {
              clearInterval(interval);
              return { ...m, installed: true, downloading: false, downloadProgress: 100 };
            }
            return { ...m, downloadProgress: next };
          }
          return m;
        });
        return updated;
      });
    }, 120);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Tab sidebar */}
      <div
        className="w-44 shrink-0 border-r py-3"
        style={{ backgroundColor: '#101318', borderColor: '#242932' }}
      >
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs transition-colors"
            style={{
              backgroundColor: tab === id ? 'rgba(124,92,252,0.12)' : 'transparent',
              color: tab === id ? '#7C5CFC' : '#8B93A1',
              borderLeft: tab === id ? '2px solid #7C5CFC' : '2px solid transparent',
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {tab === 'general' && <GeneralTab />}
        {tab === 'processing' && <ProcessingTab />}
        {tab === 'ai_providers' && (
          <AIProvidersTab showKeys={showKeys} onToggleKey={toggleKey} />
        )}
        {tab === 'remote_gpu' && (
          <RemoteGPUTab connectionState={connectionState} onTest={testConnection} />
        )}
        {tab === 'models' && (
          <ModelsTab models={models} onDownload={downloadModel} />
        )}
        {tab === 'storage' && <StorageTab />}
      </div>
    </div>
  );
}

function GeneralTab() {
  return (
    <Section title="General">
      <SettingGroup title="Language">
        <Select label="Interface Language" options={['English', 'Vietnamese', 'Japanese']} defaultValue="English" />
      </SettingGroup>
      <SettingGroup title="Theme">
        <RadioGroup
          label="Color Theme"
          options={['Dark', 'Light', 'System']}
          defaultValue="Dark"
        />
      </SettingGroup>
      <SettingGroup title="Startup">
        <Toggle label="Start with Windows" defaultValue={false} />
        <Toggle label="Minimize to tray on close" defaultValue={true} />
      </SettingGroup>
      <SettingGroup title="Notifications">
        <Toggle label="Job completed" defaultValue={true} />
        <Toggle label="Job failed" defaultValue={true} />
        <Toggle label="Disk space warning" defaultValue={true} />
        <Toggle label="Remote GPU disconnected" defaultValue={true} />
      </SettingGroup>
    </Section>
  );
}

function ProcessingTab() {
  return (
    <Section title="Processing">
      <SettingGroup title="Folders">
        <FolderField label="Default Output Folder" value="D:\AutoYT\Output" />
        <FolderField label="Temporary Folder" value="C:\Users\User\AppData\Local\Temp\AutoYT" />
      </SettingGroup>
      <SettingGroup title="Job Queue">
        <NumberField label="Maximum Concurrent Jobs" defaultValue={2} min={1} max={8} />
        <NumberField label="Retry Count" defaultValue={3} min={0} max={10} />
      </SettingGroup>
    </Section>
  );
}

function AIProvidersTab({ showKeys, onToggleKey }: { showKeys: Record<string, boolean>; onToggleKey: (k: string) => void }) {
  const providers = [
    { key: 'gemini', label: 'Gemini', placeholder: 'AIza...' },
    { key: 'openai', label: 'OpenAI', placeholder: 'sk-...' },
    { key: 'claude', label: 'Claude (Anthropic)', placeholder: 'sk-ant-...' },
  ];
  return (
    <Section title="AI Providers">
      {providers.map(({ key, label, placeholder }) => (
        <SettingGroup key={key} title={label}>
          <div>
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#8B93A1' }}>
              API Key
            </label>
            <div className="flex items-center gap-2">
              <input
                type={showKeys[key] ? 'text' : 'password'}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-md text-xs outline-none font-mono"
                style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}
              />
              <button
                onClick={() => onToggleKey(key)}
                className="p-2 rounded-md"
                style={{ backgroundColor: '#151920', border: '1px solid #242932', color: '#8B93A1' }}
              >
                {showKeys[key] ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        </SettingGroup>
      ))}
    </Section>
  );
}

function RemoteGPUTab({ connectionState, onTest }: { connectionState: ConnectionState; onTest: () => void }) {
  return (
    <Section title="Remote GPU">
      <SettingGroup title="Connection">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Host" placeholder="192.168.1.100" defaultValue="192.168.1.50" />
          <TextField label="Port" placeholder="22" defaultValue="22" />
          <TextField label="Username" placeholder="user" defaultValue="admin" />
          <div>
            <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#8B93A1' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md text-xs outline-none"
              style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}
            />
          </div>
        </div>
        <button
          onClick={onTest}
          disabled={connectionState === 'testing'}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold mt-2"
          style={{ backgroundColor: '#7C5CFC', color: '#fff', opacity: connectionState === 'testing' ? 0.7 : 1 }}
          onMouseEnter={(e) => { if (connectionState !== 'testing') e.currentTarget.style.backgroundColor = '#6B4EE8'; }}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C5CFC')}
        >
          {connectionState === 'testing' ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Wifi size={13} />
          )}
          {connectionState === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>

        {connectionState === 'done' && (
          <div
            className="mt-3 p-3 rounded-md border"
            style={{ backgroundColor: '#0F1318', borderColor: '#242932' }}
          >
            <p className="text-[11px] font-semibold mb-2" style={{ color: '#F5F7FA' }}>
              Connection Diagnostics
            </p>
            {GPU_CHECKS.map(({ key, label, ok }) => (
              <div key={key} className="flex items-center gap-2 py-1">
                {ok ? (
                  <Check size={12} style={{ color: '#32D583' }} />
                ) : (
                  <X size={12} style={{ color: '#F04438' }} />
                )}
                <span className="text-xs" style={{ color: ok ? '#C5CBD6' : '#F04438' }}>
                  {label}
                </span>
                {!ok && (
                  <button
                    className="ml-auto text-[10px] px-2 py-0.5 rounded font-medium"
                    style={{ backgroundColor: 'rgba(124,92,252,0.15)', color: '#7C5CFC' }}
                  >
                    Auto Deploy
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </SettingGroup>
    </Section>
  );
}

function ModelsTab({ models, onDownload }: { models: AIModel[]; onDownload: (id: string) => void }) {
  const groups: Record<string, AIModel[]> = {};
  models.forEach((m) => {
    groups[m.type] = [...(groups[m.type] ?? []), m];
  });

  const typeLabels: Record<string, string> = {
    whisper: 'Whisper (Speech Recognition)',
    tts: 'TTS (Text-to-Speech)',
    demucs: 'Demucs (Audio Separation)',
    translation: 'Translation',
  };

  return (
    <Section title="Models">
      {Object.entries(groups).map(([type, ms]) => (
        <SettingGroup key={type} title={typeLabels[type] ?? type}>
          <div className="space-y-1.5">
            {ms.map((model) => (
              <ModelRow key={model.id} model={model} onDownload={onDownload} />
            ))}
          </div>
        </SettingGroup>
      ))}
    </Section>
  );
}

function ModelRow({ model, onDownload }: { model: AIModel; onDownload: (id: string) => void }) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-md border"
      style={{ backgroundColor: '#0F1318', borderColor: '#1E2530' }}
    >
      <div className="flex-1">
        <p className="text-xs font-medium" style={{ color: '#F5F7FA' }}>{model.name}</p>
        <p className="text-[10px] mt-0.5" style={{ color: '#8B93A1' }}>{model.size}</p>
      </div>

      {model.downloading ? (
        <div className="flex items-center gap-2">
          <div className="w-24 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#242932' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${model.downloadProgress ?? 0}%`, backgroundColor: '#7C5CFC' }}
            />
          </div>
          <span className="text-[11px]" style={{ color: '#7C5CFC' }}>
            {model.downloadProgress}%
          </span>
        </div>
      ) : model.installed ? (
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: 'rgba(50,213,131,0.12)', color: '#32D583' }}
        >
          Installed
        </span>
      ) : (
        <button
          onClick={() => onDownload(model.id)}
          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded font-medium"
          style={{ backgroundColor: 'rgba(124,92,252,0.15)', color: '#7C5CFC', border: '1px solid rgba(124,92,252,0.3)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,252,0.25)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,252,0.15)')}
        >
          <Download size={11} />
          Download
        </button>
      )}
    </div>
  );
}

function StorageTab() {
  const storageItems = [
    { label: 'Application', size: '142 MB', pct: 1 },
    { label: 'AI Models', size: '9.2 GB', pct: 11 },
    { label: 'Cache', size: '4.1 GB', pct: 5 },
    { label: 'Output Files', size: '70.6 GB', pct: 83 },
  ];

  return (
    <Section title="Storage">
      <SettingGroup title="Disk Usage">
        <div className="space-y-3">
          {storageItems.map(({ label, size, pct }) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: '#C5CBD6' }}>{label}</span>
                <span className="text-xs font-medium" style={{ color: '#F5F7FA' }}>{size}</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#242932' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: '#7C5CFC' }}
                />
              </div>
            </div>
          ))}
        </div>
      </SettingGroup>

      <SettingGroup title="Actions">
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium border"
            style={{ backgroundColor: '#151920', borderColor: '#242932', color: '#C5CBD6' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A2030')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#151920')}
          >
            <Trash2 size={12} />
            Clear Cache
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium border"
            style={{ backgroundColor: '#151920', borderColor: '#242932', color: '#C5CBD6' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A2030')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#151920')}
          >
            <ChevronRight size={12} />
            Open Output Folder
          </button>
        </div>
      </SettingGroup>
    </Section>
  );
}

// ── Primitives ────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl space-y-5">
      <h2 className="text-sm font-semibold" style={{ color: '#F5F7FA' }}>{title}</h2>
      {children}
    </div>
  );
}

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-md border p-4 space-y-3"
      style={{ backgroundColor: '#151920', borderColor: '#242932' }}
    >
      <h3 className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: '#8B93A1' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Toggle({ label, defaultValue }: { label: string; defaultValue: boolean }) {
  const [on, setOn] = useState(defaultValue);
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: '#C5CBD6' }}>{label}</span>
      <button
        onClick={() => setOn((v) => !v)}
        className="w-9 h-5 rounded-full flex items-center transition-colors"
        style={{
          backgroundColor: on ? '#7C5CFC' : '#242932',
          justifyContent: on ? 'flex-end' : 'flex-start',
          padding: '2px',
        }}
      >
        <div className="w-3.5 h-3.5 rounded-full bg-white transition-all" />
      </button>
    </div>
  );
}

function Select({ label, options, defaultValue }: { label: string; options: string[]; defaultValue: string }) {
  return (
    <div>
      <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#8B93A1' }}>{label}</label>
      <select
        defaultValue={defaultValue}
        className="px-3 py-2 rounded-md text-xs outline-none"
        style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function RadioGroup({ label, options, defaultValue }: { label: string; options: string[]; defaultValue: string }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div>
      <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#8B93A1' }}>{label}</label>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setVal(o)}
            className="px-3 py-1.5 rounded-md text-[11px] font-medium border"
            style={{
              backgroundColor: val === o ? 'rgba(124,92,252,0.1)' : '#0F1318',
              borderColor: val === o ? '#7C5CFC' : '#242932',
              color: val === o ? '#F5F7FA' : '#8B93A1',
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextField({ label, placeholder, defaultValue }: { label: string; placeholder?: string; defaultValue?: string }) {
  return (
    <div>
      <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#8B93A1' }}>{label}</label>
      <input
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 rounded-md text-xs outline-none"
        style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}
      />
    </div>
  );
}

function NumberField({ label, defaultValue, min, max }: { label: string; defaultValue: number; min: number; max: number }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs" style={{ color: '#C5CBD6' }}>{label}</label>
      <input
        type="number"
        defaultValue={defaultValue}
        min={min}
        max={max}
        className="w-16 px-2 py-1 rounded text-xs text-center outline-none"
        style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}
      />
    </div>
  );
}

function FolderField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#8B93A1' }}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          defaultValue={value}
          className="flex-1 px-3 py-2 rounded-md text-xs outline-none font-mono"
          style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#C5CBD6' }}
        />
        <button
          className="px-3 py-2 rounded-md text-xs border"
          style={{ backgroundColor: '#151920', borderColor: '#242932', color: '#C5CBD6' }}
        >
          Browse
        </button>
      </div>
    </div>
  );
}
