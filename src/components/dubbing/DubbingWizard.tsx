import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  FileVideo,
  FolderOpen,
  Link2,
  Mic2,
  Play,
  Plus,
  Settings2,
  Upload,
  Volume2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type { VoiceProfile } from '../../types';
import { mockVoices } from '../../data/mock';

interface DubbingWizardProps {
  onClose: () => void;
  onStart: () => void;
}

const STEPS = ['Source', 'Configuration', 'Voice', 'Output', 'Review'];

type StageConfig = {
  id: string;
  label: string;
  enabled: boolean;
  engine: string;
  target: 'local' | 'remote';
};

const DEFAULT_STAGES: StageConfig[] = [
  { id: 'download', label: 'Download', enabled: true, engine: 'yt-dlp', target: 'local' },
  { id: 'ocr', label: 'OCR', enabled: true, engine: 'PaddleOCR', target: 'local' },
  { id: 'transcript', label: 'Transcript', enabled: true, engine: 'Whisper v3', target: 'remote' },
  { id: 'translation', label: 'Translation', enabled: true, engine: 'Gemini Flash', target: 'remote' },
  { id: 'tts', label: 'TTS', enabled: true, engine: 'VietTTS v2.1', target: 'remote' },
  { id: 'audio_mix', label: 'Audio Mix', enabled: true, engine: 'FFmpeg', target: 'local' },
  { id: 'render', label: 'Render', enabled: true, engine: 'FFmpeg', target: 'local' },
  { id: 'subtitle', label: 'Subtitle', enabled: true, engine: 'ASS Renderer', target: 'local' },
];

const MOCK_FILES = [
  { name: 'anime_ep05_raw.mp4', duration: '24:18', size: '1.2 GB', status: 'ready' as const },
  { name: 'anime_ep06_raw.mp4', duration: '23:55', size: '1.1 GB', status: 'ready' as const },
];

export function DubbingWizard({ onClose, onStart }: DubbingWizardProps) {
  const [step, setStep] = useState(0);
  const [stages, setStages] = useState<StageConfig[]>(DEFAULT_STAGES);
  const [selectedSeries, setSelectedSeries] = useState('s1');
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile>(mockVoices[0]);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [resolution, setResolution] = useState('1080p');
  const [outputScope, setOutputScope] = useState<'episode' | 'series'>('series');
  const [dragging, setDragging] = useState(false);

  const canNext = step < STEPS.length - 1;
  const canPrev = step > 0;

  const toggleStage = (id: string) => {
    setStages((s) =>
      s.map((st) => (st.id === id ? { ...st, enabled: !st.enabled } : st))
    );
  };

  const toggleTarget = (id: string) => {
    setStages((s) =>
      s.map((st) =>
        st.id === id ? { ...st, target: st.target === 'local' ? 'remote' : 'local' } : st
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div
        className="w-[860px] h-[600px] rounded-lg border flex flex-col overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#101318', borderColor: '#242932' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: '#242932' }}
        >
          <div className="flex items-center gap-2">
            <Mic2 size={16} style={{ color: '#7C5CFC' }} />
            <span className="text-sm font-semibold" style={{ color: '#F5F7FA' }}>
              New Dubbing
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <button
                  onClick={() => i < step && setStep(i)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{ cursor: i < step ? 'pointer' : 'default' }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor:
                        i < step ? '#32D583' : i === step ? '#7C5CFC' : '#242932',
                      color: i <= step ? '#fff' : '#8B93A1',
                    }}
                  >
                    {i < step ? <Check size={10} /> : i + 1}
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: i === step ? '#F5F7FA' : i < step ? '#32D583' : '#8B93A1' }}
                  >
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-6 h-px mx-1"
                    style={{ backgroundColor: i < step ? '#32D583' : '#242932' }}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded transition-colors"
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {step === 0 && (
            <StepSource
              dragging={dragging}
              setDragging={setDragging}
              selectedSeries={selectedSeries}
              setSelectedSeries={setSelectedSeries}
              files={MOCK_FILES}
            />
          )}
          {step === 1 && (
            <StepConfiguration
              stages={stages}
              onToggle={toggleStage}
              onToggleTarget={toggleTarget}
            />
          )}
          {step === 2 && (
            <StepVoice
              voices={mockVoices}
              selected={selectedVoice}
              onSelect={setSelectedVoice}
              scope={outputScope}
              onScopeChange={setOutputScope}
            />
          )}
          {step === 3 && (
            <StepOutput
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              resolution={resolution}
              setResolution={setResolution}
              files={MOCK_FILES}
            />
          )}
          {step === 4 && (
            <StepReview
              files={MOCK_FILES}
              stages={stages}
              voice={selectedVoice}
              aspectRatio={aspectRatio}
              resolution={resolution}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-3 border-t shrink-0"
          style={{ borderColor: '#242932' }}
        >
          <button
            onClick={canPrev ? () => setStep(step - 1) : onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium"
            style={{ backgroundColor: '#1A2030', color: '#C5CBD6', border: '1px solid #242932' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#242932')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A2030')}
          >
            <ArrowLeft size={13} />
            {canPrev ? 'Back' : 'Cancel'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: '#8B93A1' }}>
              Step {step + 1} of {STEPS.length}
            </span>
          </div>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium"
              style={{ backgroundColor: '#7C5CFC', color: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6B4EE8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C5CFC')}
            >
              Next
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={() => { onStart(); onClose(); }}
              className="flex items-center gap-1.5 px-5 py-2 rounded text-xs font-semibold"
              style={{ backgroundColor: '#7C5CFC', color: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6B4EE8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C5CFC')}
            >
              <Play size={13} />
              Start Processing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Source ────────────────────────────────────────────
function StepSource({ dragging, setDragging, selectedSeries, setSelectedSeries, files }: {
  dragging: boolean;
  setDragging: (v: boolean) => void;
  selectedSeries: string;
  setSelectedSeries: (v: string) => void;
  files: typeof MOCK_FILES;
}) {
  return (
    <div className="grid grid-cols-2 gap-5 h-full">
      {/* Left: import options */}
      <div className="space-y-4">
        <Label>Import Source</Label>

        {/* Drop zone */}
        <div
          className="rounded-md border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 text-center transition-colors"
          style={{
            borderColor: dragging ? '#7C5CFC' : '#242932',
            backgroundColor: dragging ? 'rgba(124,92,252,0.06)' : 'rgba(255,255,255,0.01)',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
        >
          <Upload size={24} style={{ color: dragging ? '#7C5CFC' : '#8B93A1' }} />
          <div>
            <p className="text-xs font-medium" style={{ color: '#F5F7FA' }}>
              Drop video files here
            </p>
            <p className="text-[11px] mt-1" style={{ color: '#8B93A1' }}>
              MP4, MKV, AVI supported
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <FileVideo size={13} />, label: 'Select Files' },
            { icon: <FolderOpen size={13} />, label: 'Select Folder' },
            { icon: <Link2 size={13} />, label: 'Import URL' },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-1.5 py-3 rounded-md text-[11px] font-medium border transition-colors"
              style={{ backgroundColor: '#151920', borderColor: '#242932', color: '#C5CBD6' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7C5CFC')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#242932')}
            >
              <span style={{ color: '#7C5CFC' }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <div>
          <Label>Series</Label>
          <div className="mt-1.5 space-y-1">
            {[
              { id: 's1', label: 'Anime Highlights JP→VI' },
              { id: 'new', label: '+ Create New Series' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSelectedSeries(id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-left border transition-colors"
                style={{
                  backgroundColor: selectedSeries === id ? 'rgba(124,92,252,0.1)' : '#151920',
                  borderColor: selectedSeries === id ? '#7C5CFC' : '#242932',
                  color: selectedSeries === id ? '#F5F7FA' : '#C5CBD6',
                }}
              >
                {id === 'new' ? <Plus size={12} style={{ color: '#7C5CFC' }} /> : <Layers size={12} style={{ color: '#7C5CFC' }} />}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: episode list */}
      <div>
        <Label>Episodes ({files.length})</Label>
        <div
          className="mt-1.5 rounded-md border overflow-hidden"
          style={{ borderColor: '#242932' }}
        >
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #242932', backgroundColor: '#0F1318' }}>
                {['File', 'Duration', 'Size', 'Status'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium" style={{ color: '#8B93A1' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {files.map((f, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1A2030' }}>
                  <td className="px-3 py-2 font-mono text-[11px]" style={{ color: '#C5CBD6' }}>{f.name}</td>
                  <td className="px-3 py-2" style={{ color: '#8B93A1' }}>{f.duration}</td>
                  <td className="px-3 py-2" style={{ color: '#8B93A1' }}>{f.size}</td>
                  <td className="px-3 py-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(50,213,131,0.12)', color: '#32D583' }}>
                      Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Configuration ─────────────────────────────────────
function StepConfiguration({ stages, onToggle, onToggleTarget }: {
  stages: StageConfig[];
  onToggle: (id: string) => void;
  onToggleTarget: (id: string) => void;
}) {
  return (
    <div>
      <Label>Pipeline Stages</Label>
      <p className="text-[11px] mb-4 mt-1" style={{ color: '#8B93A1' }}>
        Configure each stage — toggle, pick engine, and choose execution target.
      </p>
      <div className="space-y-1">
        {stages.map((stage, i) => (
          <div key={stage.id}>
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-md"
              style={{ backgroundColor: stage.enabled ? '#151920' : '#101318', border: `1px solid ${stage.enabled ? '#242932' : '#1A2030'}` }}
            >
              {/* Toggle */}
              <button
                onClick={() => onToggle(stage.id)}
                className="w-8 h-4 rounded-full flex items-center transition-colors shrink-0"
                style={{
                  backgroundColor: stage.enabled ? '#7C5CFC' : '#242932',
                  justifyContent: stage.enabled ? 'flex-end' : 'flex-start',
                  padding: '2px',
                }}
              >
                <div className="w-3 h-3 rounded-full bg-white" />
              </button>

              {/* Stage name */}
              <span
                className="text-xs font-semibold w-24 shrink-0"
                style={{ color: stage.enabled ? '#F5F7FA' : '#4A5568' }}
              >
                {stage.label}
              </span>

              {/* Engine */}
              <div className="flex-1">
                <span
                  className="text-[11px] px-2 py-1 rounded border"
                  style={{ backgroundColor: '#0F1318', borderColor: '#242932', color: '#C5CBD6' }}
                >
                  {stage.engine}
                </span>
              </div>

              {/* Target toggle */}
              <button
                onClick={() => onToggleTarget(stage.id)}
                disabled={!stage.enabled}
                className="text-[10px] px-2 py-1 rounded font-medium transition-colors"
                style={{
                  backgroundColor: stage.target === 'remote' ? 'rgba(124,92,252,0.15)' : '#1A2030',
                  color: stage.target === 'remote' ? '#7C5CFC' : '#8B93A1',
                  opacity: stage.enabled ? 1 : 0.4,
                  border: `1px solid ${stage.target === 'remote' ? 'rgba(124,92,252,0.3)' : '#242932'}`,
                }}
              >
                {stage.target.toUpperCase()}
              </button>
            </div>
            {i < stages.length - 1 && (
              <div className="flex justify-center py-0.5">
                <div className="w-px h-3" style={{ backgroundColor: '#242932' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 3: Voice ─────────────────────────────────────────────
function StepVoice({ voices, selected, onSelect, scope, onScopeChange }: {
  voices: VoiceProfile[];
  selected: VoiceProfile;
  onSelect: (v: VoiceProfile) => void;
  scope: 'episode' | 'series';
  onScopeChange: (s: 'episode' | 'series') => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Label>Narrator Voice</Label>
        <div className="mt-2 space-y-1.5">
          {voices.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(v)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border text-left transition-colors"
              style={{
                backgroundColor: selected.id === v.id ? 'rgba(124,92,252,0.1)' : '#151920',
                borderColor: selected.id === v.id ? '#7C5CFC' : '#242932',
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: selected.id === v.id ? '#7C5CFC' : '#242932' }}
              >
                <Volume2 size={11} style={{ color: selected.id === v.id ? '#fff' : '#8B93A1' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium" style={{ color: '#F5F7FA' }}>{v.name}</p>
                <p className="text-[10px]" style={{ color: '#8B93A1' }}>{v.engine} · {v.style}</p>
              </div>
              <button
                className="p-1 rounded"
                style={{ backgroundColor: '#1A2030', color: '#8B93A1' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Play size={10} />
              </button>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Apply To</Label>
          <div className="mt-2 flex gap-2">
            {(['episode', 'series'] as const).map((s) => (
              <button
                key={s}
                onClick={() => onScopeChange(s)}
                className="flex-1 py-2 rounded-md text-xs font-medium border transition-colors capitalize"
                style={{
                  backgroundColor: scope === s ? 'rgba(124,92,252,0.1)' : '#151920',
                  borderColor: scope === s ? '#7C5CFC' : '#242932',
                  color: scope === s ? '#F5F7FA' : '#8B93A1',
                }}
              >
                {s === 'episode' ? 'This Episode' : 'Entire Series'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Voice Settings</Label>
          <div className="mt-2 space-y-3">
            <SliderRow label="Speed" value={100} unit="%" />
            <SliderRow label="Pitch" value={0} unit="st" signed />
          </div>
        </div>

        <div>
          <Label>Character Voice Mapping</Label>
          <div
            className="mt-2 p-3 rounded-md border text-center"
            style={{ borderColor: '#242932', borderStyle: 'dashed', color: '#8B93A1' }}
          >
            <p className="text-xs">Character detection requires OCR stage</p>
            <button className="mt-2 text-[11px]" style={{ color: '#7C5CFC' }}>
              + Add Character Voice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, value, unit, signed }: { label: string; value: number; unit: string; signed?: boolean }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11px]" style={{ color: '#8B93A1' }}>{label}</span>
        <span className="text-[11px] font-mono" style={{ color: '#C5CBD6' }}>
          {signed && value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={signed ? -12 : 50}
        max={signed ? 12 : 200}
        defaultValue={value}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: '#7C5CFC', backgroundColor: '#242932' }}
      />
    </div>
  );
}

// ── Step 4: Output ────────────────────────────────────────────
function StepOutput({ aspectRatio, setAspectRatio, resolution, setResolution, files }: {
  aspectRatio: '16:9' | '9:16' | '1:1';
  setAspectRatio: (v: '16:9' | '9:16' | '1:1') => void;
  resolution: string;
  setResolution: (v: string) => void;
  files: typeof MOCK_FILES;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label>Aspect Ratio</Label>
          <div className="flex gap-2 mt-2">
            {(['16:9', '9:16', '1:1'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                className="flex-1 py-2 rounded-md text-xs font-medium border"
                style={{
                  backgroundColor: aspectRatio === r ? 'rgba(124,92,252,0.1)' : '#151920',
                  borderColor: aspectRatio === r ? '#7C5CFC' : '#242932',
                  color: aspectRatio === r ? '#F5F7FA' : '#8B93A1',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Resolution</Label>
          <div className="flex gap-2 mt-2">
            {['720p', '1080p', '4K'].map((r) => (
              <button
                key={r}
                onClick={() => setResolution(r)}
                className="flex-1 py-2 rounded-md text-xs font-medium border"
                style={{
                  backgroundColor: resolution === r ? 'rgba(124,92,252,0.1)' : '#151920',
                  borderColor: resolution === r ? '#7C5CFC' : '#242932',
                  color: resolution === r ? '#F5F7FA' : '#8B93A1',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Codec</Label>
          <div className="mt-2 flex gap-2">
            {['H.264', 'H.265'].map((c) => (
              <button
                key={c}
                className="flex-1 py-2 rounded-md text-xs font-medium border"
                style={{ backgroundColor: c === 'H.264' ? 'rgba(124,92,252,0.1)' : '#151920', borderColor: c === 'H.264' ? '#7C5CFC' : '#242932', color: c === 'H.264' ? '#F5F7FA' : '#8B93A1' }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Output Folder</Label>
          <div
            className="mt-2 flex items-center gap-2 px-3 py-2 rounded-md border"
            style={{ backgroundColor: '#151920', borderColor: '#242932' }}
          >
            <FolderOpen size={13} style={{ color: '#8B93A1' }} />
            <span className="text-xs flex-1 text-mono" style={{ color: '#C5CBD6' }}>
              D:\AutoYT\Output\Anime_Highlights
            </span>
          </div>
        </div>
      </div>

      <div>
        <Label>Estimate</Label>
        <div
          className="mt-2 p-4 rounded-md border space-y-3"
          style={{ backgroundColor: '#0F1318', borderColor: '#242932' }}
        >
          {[
            { label: 'Videos to process', value: `${files.length} episodes` },
            { label: 'Estimated time', value: '~85 min' },
            { label: 'Estimated storage', value: '~4.8 GB' },
            { label: 'Execution target', value: 'Mixed (Local + Remote)' },
            { label: 'Resolution', value: `${resolution} · ${aspectRatio}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-xs" style={{ color: '#8B93A1' }}>{label}</span>
              <span className="text-xs font-medium" style={{ color: '#F5F7FA' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 5: Review ────────────────────────────────────────────
function StepReview({ files, stages, voice, aspectRatio, resolution }: {
  files: typeof MOCK_FILES;
  stages: StageConfig[];
  voice: VoiceProfile;
  aspectRatio: string;
  resolution: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="space-y-4">
        <div>
          <Label>Summary</Label>
          <div
            className="mt-2 rounded-md border overflow-hidden"
            style={{ borderColor: '#242932' }}
          >
            {[
              { label: 'Series', value: 'Anime Highlights JP→VI' },
              { label: 'Episodes', value: `${files.length} files` },
              { label: 'Voice', value: `${voice.name} (${voice.engine})` },
              { label: 'Output', value: `${resolution} · ${aspectRatio}` },
              { label: 'Estimated time', value: '~85 minutes' },
              { label: 'Estimated size', value: '~4.8 GB' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between px-3 py-2 border-b last:border-0"
                style={{ borderColor: '#1A2030' }}
              >
                <span className="text-xs" style={{ color: '#8B93A1' }}>{label}</span>
                <span className="text-xs font-medium" style={{ color: '#F5F7FA' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label>Pipeline ({stages.filter((s) => s.enabled).length} stages enabled)</Label>
        <div className="mt-2 space-y-0.5">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded"
              style={{ opacity: stage.enabled ? 1 : 0.4 }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: stage.enabled ? '#32D583' : '#4A5568' }}
              />
              <span className="text-xs flex-1" style={{ color: stage.enabled ? '#C5CBD6' : '#4A5568' }}>
                {stage.label}
              </span>
              <span className="text-[10px]" style={{ color: '#8B93A1' }}>{stage.engine}</span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: stage.target === 'remote' ? 'rgba(124,92,252,0.15)' : '#1A2030',
                  color: stage.target === 'remote' ? '#7C5CFC' : '#8B93A1',
                }}
              >
                {stage.target.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: '#8B93A1' }}>
      {children}
    </span>
  );
}

function Layers({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={style}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
