'use client';

import { useRef, useState, useCallback } from 'react';
import {
  Info,
  Upload,
  Download,
  MapPin,
  Camera,
  Settings2,
  Clock,
  ImageIcon,
  Shield,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ExifData {
  // Camera
  Make?: string;
  Model?: string;
  Software?: string;
  // Settings
  FNumber?: number;
  ISO?: number;
  ExposureTime?: number;
  FocalLength?: number;
  Flash?: number;
  // DateTime
  DateTimeOriginal?: Date | string;
  DateTime?: Date | string;
  // GPS
  latitude?: number;
  longitude?: number;
  GPSAltitude?: number;
  // Image
  ImageWidth?: number;
  ImageHeight?: number;
  Orientation?: number;
  ColorSpace?: number;
  BitsPerSample?: number;
  // Copyright
  Artist?: string;
  Copyright?: string;
  [key: string]: unknown;
}

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  fields: { key: keyof ExifData | string; label: string; format?: (v: unknown) => string }[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatExposureTime = (v: unknown): string => {
  if (typeof v !== 'number') return String(v);
  if (v >= 1) return `${v}s`;
  return `1/${Math.round(1 / v)}s`;
};

const formatAperture = (v: unknown): string =>
  typeof v === 'number' ? `f/${v.toFixed(1)}` : String(v);

const formatFocalLength = (v: unknown): string =>
  typeof v === 'number' ? `${v}mm` : String(v);

const formatISO = (v: unknown): string =>
  typeof v === 'number' ? `ISO ${v}` : String(v);

const formatDate = (v: unknown): string => {
  if (!v) return '';
  try {
    return new Date(v as string).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return String(v);
  }
};

const formatOrientation = (v: unknown): string => {
  const map: Record<number, string> = {
    1: 'Normal',
    2: 'Mirrored Horizontal',
    3: 'Rotated 180°',
    4: 'Mirrored Vertical',
    5: 'Mirrored Horizontal + Rotated 270°',
    6: 'Rotated 90° CW',
    7: 'Mirrored Horizontal + Rotated 90°',
    8: 'Rotated 270° CW',
  };
  return typeof v === 'number' ? (map[v] ?? `${v}`) : String(v);
};

const formatColorSpace = (v: unknown): string => {
  if (v === 1) return 'sRGB';
  if (v === 65535) return 'Uncalibrated';
  return String(v);
};

const formatFlash = (v: unknown): string => {
  if (typeof v !== 'number') return String(v);
  return (v & 1) === 1 ? 'Flash fired' : 'No flash';
};

const formatCoord = (v: unknown): string =>
  typeof v === 'number' ? v.toFixed(6) : String(v);

const SECTIONS: Section[] = [
  {
    id: 'camera',
    label: 'Camera Info',
    icon: <Camera className="w-4 h-4" />,
    color: 'indigo',
    fields: [
      { key: 'Make', label: 'Make' },
      { key: 'Model', label: 'Model' },
      { key: 'Software', label: 'Software' },
    ],
  },
  {
    id: 'settings',
    label: 'Capture Settings',
    icon: <Settings2 className="w-4 h-4" />,
    color: 'violet',
    fields: [
      { key: 'FNumber', label: 'Aperture', format: formatAperture },
      { key: 'ISO', label: 'ISO', format: formatISO },
      { key: 'ExposureTime', label: 'Exposure Time', format: formatExposureTime },
      { key: 'FocalLength', label: 'Focal Length', format: formatFocalLength },
      { key: 'Flash', label: 'Flash', format: formatFlash },
    ],
  },
  {
    id: 'datetime',
    label: 'Date & Time',
    icon: <Clock className="w-4 h-4" />,
    color: 'sky',
    fields: [
      { key: 'DateTimeOriginal', label: 'Date Taken', format: formatDate },
      { key: 'DateTime', label: 'Date Modified', format: formatDate },
    ],
  },
  {
    id: 'image',
    label: 'Image Info',
    icon: <ImageIcon className="w-4 h-4" />,
    color: 'amber',
    fields: [
      { key: 'ImageWidth', label: 'Width', format: (v) => `${v}px` },
      { key: 'ImageHeight', label: 'Height', format: (v) => `${v}px` },
      { key: 'Orientation', label: 'Orientation', format: formatOrientation },
      { key: 'ColorSpace', label: 'Color Space', format: formatColorSpace },
      { key: 'BitsPerSample', label: 'Bits Per Sample', format: (v) => `${v}-bit` },
    ],
  },
  {
    id: 'copyright',
    label: 'Copyright',
    icon: <Shield className="w-4 h-4" />,
    color: 'rose',
    fields: [
      { key: 'Artist', label: 'Artist' },
      { key: 'Copyright', label: 'Copyright' },
    ],
  },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  indigo: {
    border: 'border-indigo-200 dark:border-indigo-800',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
  },
  violet: {
    border: 'border-violet-200 dark:border-violet-800',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300',
  },
  sky: {
    border: 'border-sky-200 dark:border-sky-800',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    text: 'text-sky-600 dark:text-sky-400',
    badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300',
  },
  amber: {
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  },
  rose: {
    border: 'border-rose-200 dark:border-rose-800',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
  },
  emerald: {
    border: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
  },
};

// ─── Component ─────────────────────────────────────────────────────────────

export function ExifViewerTool() {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const processFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setExifData(null);
    setFileName(file.name);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const exifr = await import('exifr');
      const data = await exifr.parse(file, {
        tiff: true,
        xmp: false,
        icc: false,
        iptc: false,
        gps: true,
        mergeOutput: true,
        translateValues: false,
      });

      if (!data || Object.keys(data).length === 0) {
        setExifData(null);
        setError('no-exif');
      } else {
        setExifData(data as ExifData);
      }
    } catch {
      setError('Failed to read image metadata. The file may be corrupt or unsupported.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        processFile(file);
      } else {
        setError('Please drop a valid image file.');
      }
    },
    [processFile]
  );

  const clearAll = () => {
    setImagePreview(null);
    setExifData(null);
    setError(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadJson = () => {
    if (!exifData) return;
    const blob = new Blob([JSON.stringify(exifData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName.replace(/\.[^.]+$/, '')}_exif.json`;
    a.click();
  };

  const hasGps = exifData && exifData.latitude != null && exifData.longitude != null;
  const mapsUrl = hasGps
    ? `https://www.google.com/maps?q=${exifData!.latitude},${exifData!.longitude}`
    : null;

  const getSectionFields = (section: Section) =>
    section.fields.filter(
      (f) => exifData && exifData[f.key as keyof ExifData] != null
    );

  const hasSectionData = (section: Section) => getSectionFields(section).length > 0;

  const visibleSections = SECTIONS.filter(hasSectionData);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !imagePreview && fileInputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-200
          ${isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-[1.01] cursor-copy'
            : imagePreview
            ? 'border-slate-200 dark:border-slate-700'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'
          }
        `}
      >
        {imagePreview ? (
          <div className="relative p-4">
            <button
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-800/70 text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={imagePreview}
              alt="Uploaded image"
              className="max-h-56 mx-auto rounded-xl object-contain"
            />
            {fileName && (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                {fileName}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <Info className="w-8 h-8 text-indigo-500" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Drop an image to view its EXIF data
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                or click to browse — JPG, JPEG, TIFF, HEIC, PNG
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/tiff,image/heic,image/png"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Action bar */}
      {imagePreview && (
        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload another
          </button>
          {exifData && (
            <button
              onClick={downloadJson}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-8 text-indigo-600 dark:text-indigo-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Reading EXIF metadata...</span>
        </div>
      )}

      {/* No EXIF found */}
      {error === 'no-exif' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">No EXIF metadata found</p>
            <p className="text-sm mt-0.5 text-amber-600 dark:text-amber-500">
              JPEGs from social media often have metadata stripped. Try an original file directly from your camera or phone.
            </p>
          </div>
        </div>
      )}

      {/* Other error */}
      {error && error !== 'no-exif' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* GPS Card */}
      {exifData && hasGps && (
        <div className={`rounded-2xl border p-5 space-y-3 ${COLOR_MAP.emerald.border} ${COLOR_MAP.emerald.bg}`}>
          <div className={`flex items-center gap-2 ${COLOR_MAP.emerald.text}`}>
            <MapPin className="w-4 h-4" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">GPS Location</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ExifField label="Latitude" value={formatCoord(exifData.latitude)} />
            <ExifField label="Longitude" value={formatCoord(exifData.longitude)} />
            {exifData.GPSAltitude != null && (
              <ExifField label="Altitude" value={`${(exifData.GPSAltitude as number).toFixed(1)}m`} />
            )}
          </div>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${COLOR_MAP.emerald.text} hover:underline`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View on Google Maps
            </a>
          )}
        </div>
      )}

      {/* Data sections */}
      {exifData && visibleSections.map((section) => {
        const colors = COLOR_MAP[section.color];
        const fields = getSectionFields(section);
        const isCollapsed = collapsedSections.has(section.id);

        return (
          <div key={section.id} className={`rounded-2xl border ${colors.border} overflow-hidden`}>
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 ${colors.bg} transition-colors`}
            >
              <div className={`flex items-center gap-2 font-semibold text-sm text-slate-800 dark:text-slate-100 ${colors.text}`}>
                {section.icon}
                <span className="text-slate-800 dark:text-slate-100">{section.label}</span>
                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                  {fields.length}
                </span>
              </div>
              {isCollapsed
                ? <ChevronDown className="w-4 h-4 text-slate-400" />
                : <ChevronUp className="w-4 h-4 text-slate-400" />
              }
            </button>

            {!isCollapsed && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map((f) => {
                  const raw = exifData[f.key as keyof ExifData];
                  const display = f.format ? f.format(raw) : String(raw);
                  return <ExifField key={f.key} label={f.label} value={display} />;
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Privacy note */}
      {imagePreview && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs">
          <Shield className="w-3.5 h-3.5 shrink-0" />
          <span>All processing done in your browser. Your image is not uploaded anywhere.</span>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function ExifField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg px-3 py-2.5 border border-slate-100 dark:border-slate-800">
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 break-words">{value}</p>
    </div>
  );
}
