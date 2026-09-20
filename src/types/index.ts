export type Page =
  | 'dashboard'
  | 'dubbing'
  | 'recreate'
  | 'publisher'
  | 'library'
  | 'jobs'
  | 'settings';

export type JobStatus = 'running' | 'queued' | 'completed' | 'failed' | 'paused';

export type StageStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export type StageId =
  | 'download'
  | 'ocr'
  | 'transcript'
  | 'translation'
  | 'tts'
  | 'audio_mix'
  | 'render'
  | 'subtitle';

export interface Stage {
  id: StageId;
  label: string;
  status: StageStatus;
  startTime?: string;
  duration?: string;
  engine?: string;
  target: 'local' | 'remote';
  enabled: boolean;
  logs?: string[];
  errorMessage?: string;
}

export interface Episode {
  id: string;
  seriesId: string;
  ep: number;
  filename: string;
  duration: string;
  size: string;
  status: JobStatus;
  progress: number;
  lastUpdated: string;
  jobId?: string;
}

export interface Series {
  id: string;
  name: string;
  episodeCount: number;
  completedCount: number;
  failedCount: number;
  processingCount: number;
  defaultVoice: string;
  translationProvider: string;
  outputFormat: string;
  subtitleEnabled: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  lastUpdated: string;
  thumbnail?: string;
  episodes: Episode[];
}

export interface Job {
  id: string;
  seriesId: string;
  seriesName: string;
  episodeId: string;
  episodeName: string;
  ep: number;
  status: JobStatus;
  progress: number;
  currentStage: StageId;
  stages: Stage[];
  startedAt?: string;
  elapsed?: string;
  queuedAt: string;
}

export interface SystemStatus {
  backendOnline: boolean;
  backendPort: number;
  uptime: string;
  gpuOnline: boolean;
  gpuModel: string;
  gpuUtilization: number;
  vram: { used: number; total: number };
  diskUsage: { used: number; total: number };
  runningJobs: number;
  queuedJobs: number;
  completedJobs: number;
  failedJobs: number;
}

export interface VoiceProfile {
  id: string;
  name: string;
  engine: string;
  language: string;
  style?: string;
}

export interface PublishItem {
  id: string;
  videoTitle: string;
  seriesName: string;
  platform: 'youtube' | 'tiktok' | 'facebook' | 'instagram';
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'draft';
  scheduledAt?: string;
  publishedAt?: string;
  thumbnail?: string;
}

export interface AIModel {
  id: string;
  name: string;
  type: 'whisper' | 'tts' | 'translation' | 'demucs';
  size: string;
  installed: boolean;
  downloading?: boolean;
  downloadProgress?: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}
