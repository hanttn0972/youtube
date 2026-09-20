import {
  Crop,
  Film,
  Image,
  Maximize2,
  Mic,
  Music,
  Sparkles,
  Type,
  Upload,
} from 'lucide-react';
import { useState } from 'react';

type Tool =
  | 'resize'
  | 'crop'
  | 'subtitle'
  | 'intro'
  | 'outro'
  | 'watermark'
  | 'audio';

const TOOLS: { id: Tool; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'resize', label: 'Resize', icon: <Maximize2 size={16} />, desc: 'Change aspect ratio and resolution' },
  { id: 'crop', label: 'Crop', icon: <Crop size={16} />, desc: 'Trim or crop video frames' },
  { id: 'subtitle', label: 'Subtitle Style', icon: <Type size={16} />, desc: 'Restyle subtitle appearance' },
  { id: 'intro', label: 'Intro', icon: <Film size={16} />, desc: 'Add intro clip to video' },
  { id: 'outro', label: 'Outro', icon: <Film size={16} />, desc: 'Add outro/end screen' },
  { id: 'watermark', label: 'Watermark', icon: <Image size={16} />, desc: 'Overlay logo or text watermark' },
  { id: 'audio', label: 'Audio Processing', icon: <Music size={16} />, desc: 'Normalize, denoise, or mix audio' },
];

export function Recreate() {
  const [activeTool, setActiveTool] = useState<Tool>('resize');
  const [dragging, setDragging] = useState(false);

  const tool = TOOLS.find((t) => t.id === activeTool)!;

  return (
    <div className="h-full flex overflow-hidden">
      {/* Tool picker */}
      <div
        className="w-44 shrink-0 border-r py-3"
        style={{ backgroundColor: '#101318', borderColor: '#242932' }}
      >
        <div className="px-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={13} style={{ color: '#7C5CFC' }} />
            <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: '#8B93A1' }}>
              Transformations
            </span>
          </div>
        </div>
        {TOOLS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTool(id)}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs transition-colors"
            style={{
              backgroundColor: activeTool === id ? 'rgba(124,92,252,0.12)' : 'transparent',
              color: activeTool === id ? '#7C5CFC' : '#8B93A1',
              borderLeft: activeTool === id ? '2px solid #7C5CFC' : '2px solid transparent',
            }}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Tool content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
          style={{ borderColor: '#242932' }}
        >
          <span style={{ color: '#7C5CFC' }}>{tool.icon}</span>
          <div>
            <h1 className="text-sm font-semibold" style={{ color: '#F5F7FA' }}>{tool.label}</h1>
            <p className="text-[11px]" style={{ color: '#8B93A1' }}>{tool.desc}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 grid grid-cols-2 gap-5">
          {/* Input */}
          <div>
            <Label>Input Video</Label>
            <div
              className="mt-2 rounded-md border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 text-center transition-colors"
              style={{
                borderColor: dragging ? '#7C5CFC' : '#242932',
                backgroundColor: dragging ? 'rgba(124,92,252,0.04)' : 'transparent',
              }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={() => setDragging(false)}
            >
              <Upload size={28} style={{ color: '#242932' }} />
              <div>
                <p className="text-xs font-medium" style={{ color: '#8B93A1' }}>
                  Drop video or select files
                </p>
                <p className="text-[11px] mt-1" style={{ color: '#4A5568' }}>
                  MP4, MKV, AVI
                </p>
              </div>
              <button
                className="px-3 py-1.5 rounded text-xs font-medium"
                style={{ backgroundColor: '#151920', border: '1px solid #242932', color: '#C5CBD6' }}
              >
                Browse Files
              </button>
            </div>
          </div>

          {/* Options */}
          <div>
            <Label>Options</Label>
            <div
              className="mt-2 rounded-md border p-4 space-y-4"
              style={{ backgroundColor: '#151920', borderColor: '#242932' }}
            >
              {activeTool === 'resize' && <ResizeOptions />}
              {activeTool === 'crop' && <CropOptions />}
              {activeTool === 'subtitle' && <SubtitleOptions />}
              {activeTool === 'intro' || activeTool === 'outro' ? <IntroOutroOptions type={activeTool} /> : null}
              {activeTool === 'watermark' && <WatermarkOptions />}
              {activeTool === 'audio' && <AudioOptions />}
            </div>

            <button
              className="mt-4 w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: '#7C5CFC', color: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6B4EE8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C5CFC')}
            >
              <Sparkles size={14} />
              Apply Transformation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResizeOptions() {
  return (
    <>
      <OptionRow label="Aspect Ratio">
        <div className="flex gap-2">
          {['16:9', '9:16', '1:1', '4:3'].map((r) => (
            <button
              key={r}
              className="flex-1 py-1.5 rounded text-[11px] font-medium border"
              style={{ backgroundColor: r === '16:9' ? 'rgba(124,92,252,0.1)' : '#0F1318', borderColor: r === '16:9' ? '#7C5CFC' : '#242932', color: r === '16:9' ? '#F5F7FA' : '#8B93A1' }}
            >
              {r}
            </button>
          ))}
        </div>
      </OptionRow>
      <OptionRow label="Resolution">
        <select
          className="w-full px-2 py-1.5 rounded text-xs outline-none"
          style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}
        >
          <option>720p (1280×720)</option>
          <option>1080p (1920×1080)</option>
          <option>4K (3840×2160)</option>
          <option>Custom...</option>
        </select>
      </OptionRow>
      <OptionRow label="Fill Mode">
        <div className="flex gap-2">
          {['Fit', 'Crop', 'Blur Fill'].map((m) => (
            <button key={m} className="flex-1 py-1.5 rounded text-[11px] border"
              style={{ backgroundColor: m === 'Fit' ? 'rgba(124,92,252,0.1)' : '#0F1318', borderColor: m === 'Fit' ? '#7C5CFC' : '#242932', color: m === 'Fit' ? '#F5F7FA' : '#8B93A1' }}>
              {m}
            </button>
          ))}
        </div>
      </OptionRow>
    </>
  );
}

function CropOptions() {
  return (
    <>
      <OptionRow label="Crop Mode">
        <div className="flex gap-2">
          {['Manual', 'Auto Center', 'Face Track'].map((m) => (
            <button key={m} className="flex-1 py-1.5 rounded text-[11px] border"
              style={{ backgroundColor: m === 'Manual' ? 'rgba(124,92,252,0.1)' : '#0F1318', borderColor: m === 'Manual' ? '#7C5CFC' : '#242932', color: m === 'Manual' ? '#F5F7FA' : '#8B93A1' }}>
              {m}
            </button>
          ))}
        </div>
      </OptionRow>
      <OptionRow label="Start Time"><input type="text" placeholder="00:00:00" className="w-full px-2 py-1.5 rounded text-xs font-mono outline-none" style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }} /></OptionRow>
      <OptionRow label="End Time"><input type="text" placeholder="00:00:00" className="w-full px-2 py-1.5 rounded text-xs font-mono outline-none" style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }} /></OptionRow>
    </>
  );
}

function SubtitleOptions() {
  return (
    <>
      <OptionRow label="Font">
        <select className="w-full px-2 py-1.5 rounded text-xs outline-none" style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}>
          <option>Arial</option><option>Noto Sans</option><option>Roboto</option>
        </select>
      </OptionRow>
      <OptionRow label="Size">
        <input type="range" min={12} max={48} defaultValue={24} className="w-full" style={{ accentColor: '#7C5CFC' }} />
      </OptionRow>
      <OptionRow label="Position">
        <div className="flex gap-2">
          {['Top', 'Middle', 'Bottom'].map((p) => (
            <button key={p} className="flex-1 py-1.5 rounded text-[11px] border"
              style={{ backgroundColor: p === 'Bottom' ? 'rgba(124,92,252,0.1)' : '#0F1318', borderColor: p === 'Bottom' ? '#7C5CFC' : '#242932', color: p === 'Bottom' ? '#F5F7FA' : '#8B93A1' }}>
              {p}
            </button>
          ))}
        </div>
      </OptionRow>
    </>
  );
}

function IntroOutroOptions({ type }: { type: 'intro' | 'outro' }) {
  return (
    <>
      <OptionRow label={`${type === 'intro' ? 'Intro' : 'Outro'} Clip`}>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded border text-xs"
          style={{ backgroundColor: '#0F1318', borderColor: '#242932', borderStyle: 'dashed', color: '#8B93A1' }}>
          <Upload size={12} />
          Select video clip...
        </button>
      </OptionRow>
      <OptionRow label="Transition">
        <select className="w-full px-2 py-1.5 rounded text-xs outline-none" style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}>
          <option>Fade</option><option>Cut</option><option>Slide</option>
        </select>
      </OptionRow>
    </>
  );
}

function WatermarkOptions() {
  return (
    <>
      <OptionRow label="Type">
        <div className="flex gap-2">
          {['Image', 'Text'].map((t) => (
            <button key={t} className="flex-1 py-1.5 rounded text-[11px] border"
              style={{ backgroundColor: t === 'Image' ? 'rgba(124,92,252,0.1)' : '#0F1318', borderColor: t === 'Image' ? '#7C5CFC' : '#242932', color: t === 'Image' ? '#F5F7FA' : '#8B93A1' }}>
              {t}
            </button>
          ))}
        </div>
      </OptionRow>
      <OptionRow label="Position">
        <select className="w-full px-2 py-1.5 rounded text-xs outline-none" style={{ backgroundColor: '#0F1318', border: '1px solid #242932', color: '#F5F7FA' }}>
          <option>Top Left</option><option>Top Right</option><option>Bottom Left</option><option>Bottom Right</option><option>Center</option>
        </select>
      </OptionRow>
      <OptionRow label="Opacity"><input type="range" min={0} max={100} defaultValue={70} className="w-full" style={{ accentColor: '#7C5CFC' }} /></OptionRow>
    </>
  );
}

function AudioOptions() {
  return (
    <>
      <OptionRow label="Operations">
        <div className="space-y-2">
          {['Normalize Volume', 'Reduce Background Noise', 'Remove Music (Demucs)', 'Compress Dynamic Range'].map((op) => (
            <div key={op} className="flex items-center justify-between">
              <span className="text-xs" style={{ color: '#C5CBD6' }}>{op}</span>
              <div className="w-8 h-4 rounded-full flex items-center px-0.5" style={{ backgroundColor: '#242932' }}>
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
            </div>
          ))}
        </div>
      </OptionRow>
    </>
  );
}

function OptionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-medium block mb-1.5" style={{ color: '#8B93A1' }}>{label}</label>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: '#8B93A1' }}>
      {children}
    </span>
  );
}
