'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, RotateCcw, Shield, Sun, Moon, BadgeCheck, ImagePlus, X,
  Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal,
  ThumbsUp, Send, Globe, Eye, Clock, Sparkles, Upload, History, Trash2,
  ChevronDown, AtSign
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type Platform = 'twitter' | 'instagram' | 'facebook' | 'linkedin';

interface MockupData {
  platform: Platform;
  name: string;
  handle: string;
  avatarUrl: string;
  verified: boolean;
  postText: string;
  postImageUrl: string;
  likes: number;
  retweets: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
  darkMode: boolean;
}

interface HistoryEntry {
  id: string;
  data: MockupData;
  createdAt: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PLATFORMS: { id: Platform; label: string; color: string }[] = [
  { id: 'twitter', label: 'Twitter / X', color: 'bg-black' },
  { id: 'instagram', label: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' },
];

const CHAR_LIMITS: Record<Platform, number> = {
  twitter: 280,
  instagram: 2200,
  facebook: 63206,
  linkedin: 3000,
};

const EXAMPLE_DATA: MockupData = {
  platform: 'twitter',
  name: 'Elon Musk',
  handle: 'elonmusk',
  avatarUrl: '',
  verified: true,
  postText: 'The thing I find most surprising is that people are surprised that AI is advancing rapidly. It has been obvious for years that this would happen. #AI #future',
  postImageUrl: '',
  likes: 142500,
  retweets: 18700,
  comments: 9832,
  shares: 4210,
  views: 28400000,
  timestamp: '2h',
  darkMode: true,
};

const DEFAULT_DATA: MockupData = {
  platform: 'twitter',
  name: '',
  handle: '',
  avatarUrl: '',
  verified: false,
  postText: '',
  postImageUrl: '',
  likes: 0,
  retweets: 0,
  comments: 0,
  shares: 0,
  views: 0,
  timestamp: '1h',
  darkMode: false,
};

const HISTORY_KEY = 'social-mockup-history';

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function renderTextWithHashtags(text: string, color: string) {
  const parts = text.split(/(#\w+)/g);
  return parts.map((part, i) =>
    part.startsWith('#') ? (
      <span key={i} className={color}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Platform Mockup Components ─────────────────────────────────────────────────

function TwitterMockup({ data }: { data: MockupData }) {
  const dark = data.darkMode;
  const bg = dark ? 'bg-black' : 'bg-white';
  const text = dark ? 'text-[#e7e9ea]' : 'text-[#0f1419]';
  const subtext = dark ? 'text-[#71767b]' : 'text-[#536471]';
  const border = dark ? 'border-[#2f3336]' : 'border-[#eff3f4]';
  const hashtagColor = 'text-[#1d9bf0]';

  return (
    <div className={`${bg} ${text} rounded-2xl ${border} border p-4 max-w-[598px] w-full font-['Chirp',_-apple-system,_BlinkMacSystemFont,_sans-serif]`}>
      {/* Header row */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white text-sm font-bold">
              {data.name ? getInitials(data.name) : 'U'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-bold text-[15px] leading-5 truncate">{data.name || 'User Name'}</span>
            {data.verified && (
              <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] fill-[#1d9bf0] shrink-0">
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.607-.274 1.264-.144 1.897.13.636.433 1.221.878 1.69.47.443 1.055.747 1.69.878.635.132 1.294.084 1.902-.14.272.587.702 1.087 1.24 1.44s1.167.551 1.813.568c.647-.017 1.277-.213 1.817-.567s.972-.854 1.245-1.44c.604.222 1.26.27 1.894.14.634-.131 1.218-.434 1.69-.878.445-.47.749-1.055.878-1.69.132-.635.084-1.294-.14-1.9.588-.273 1.088-.704 1.444-1.244.354-.543.551-1.174.569-1.82zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
            )}
            <span className={`${subtext} text-[15px] leading-5`}>@{data.handle || 'username'}</span>
            <span className={`${subtext} text-[15px]`}>·</span>
            <span className={`${subtext} text-[15px]`}>{data.timestamp || '1h'}</span>
          </div>

          {/* Post text */}
          <div className="mt-1 text-[15px] leading-5 whitespace-pre-wrap break-words">
            {renderTextWithHashtags(data.postText || 'Your post text will appear here...', hashtagColor)}
          </div>

          {/* Post image */}
          {data.postImageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-[#2f3336]/30">
              <img src={data.postImageUrl} alt="" className="w-full max-h-[512px] object-cover" />
            </div>
          )}

          {/* Engagement bar */}
          <div className="flex items-center justify-between mt-3 max-w-[425px]">
            <button className={`flex items-center gap-1.5 group ${subtext} text-[13px]`}>
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                <MessageCircle className="w-[18px] h-[18px]" />
              </div>
              <span>{data.comments > 0 ? formatNumber(data.comments) : ''}</span>
            </button>
            <button className={`flex items-center gap-1.5 group ${subtext} text-[13px]`}>
              <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10">
                <Repeat2 className="w-[18px] h-[18px]" />
              </div>
              <span>{data.retweets > 0 ? formatNumber(data.retweets) : ''}</span>
            </button>
            <button className={`flex items-center gap-1.5 group ${subtext} text-[13px]`}>
              <div className="p-2 rounded-full group-hover:bg-[#f91880]/10">
                <Heart className="w-[18px] h-[18px]" />
              </div>
              <span>{data.likes > 0 ? formatNumber(data.likes) : ''}</span>
            </button>
            <button className={`flex items-center gap-1.5 group ${subtext} text-[13px]`}>
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                <Eye className="w-[18px] h-[18px]" />
              </div>
              <span>{data.views > 0 ? formatNumber(data.views) : ''}</span>
            </button>
            <button className={`flex items-center gap-1.5 group ${subtext} text-[13px]`}>
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                <Bookmark className="w-[18px] h-[18px]" />
              </div>
            </button>
            <button className={`flex items-center gap-1.5 group ${subtext} text-[13px]`}>
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                <Share className="w-[18px] h-[18px]" />
              </div>
            </button>
          </div>
        </div>

        {/* More button */}
        <MoreHorizontal className={`w-5 h-5 ${subtext} shrink-0 mt-0.5`} />
      </div>
    </div>
  );
}

function InstagramMockup({ data }: { data: MockupData }) {
  const dark = data.darkMode;
  const bg = dark ? 'bg-[#000000]' : 'bg-white';
  const text = dark ? 'text-[#f5f5f5]' : 'text-[#262626]';
  const subtext = dark ? 'text-[#a8a8a8]' : 'text-[#8e8e8e]';
  const border = dark ? 'border-[#363636]' : 'border-[#dbdbdb]';

  return (
    <div className={`${bg} ${text} rounded-lg ${border} border max-w-[468px] w-full font-[-apple-system,_BlinkMacSystemFont,_'Segoe_UI',_Roboto,_sans-serif]`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt="" className="w-full h-full rounded-full object-cover border-2 border-black" />
            ) : (
              <div className={`w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold ${dark ? 'bg-black' : 'bg-white'}`}>
                <span className={dark ? 'text-white' : 'text-black'}>{data.name ? getInitials(data.name) : 'U'}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">{data.handle || 'username'}</span>
            {data.verified && (
              <BadgeCheck className="w-3.5 h-3.5 text-[#0095f6]" />
            )}
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5" />
      </div>

      {/* Post image area */}
      {data.postImageUrl ? (
        <img src={data.postImageUrl} alt="" className="w-full aspect-square object-cover" />
      ) : (
        <div className={`w-full aspect-square flex items-center justify-center ${dark ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
          <ImagePlus className={`w-16 h-16 ${subtext}`} />
        </div>
      )}

      {/* Action bar */}
      <div className="px-3 pt-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 cursor-pointer" />
            <MessageCircle className="w-6 h-6 cursor-pointer -scale-x-100" />
            <Send className="w-6 h-6 cursor-pointer -rotate-12" />
          </div>
          <Bookmark className="w-6 h-6 cursor-pointer" />
        </div>

        {/* Likes */}
        <div className="mt-2 font-semibold text-sm">
          {formatNumber(data.likes)} likes
        </div>

        {/* Caption */}
        <div className="mt-1 text-sm">
          <span className="font-semibold mr-1.5">{data.handle || 'username'}</span>
          <span className="whitespace-pre-wrap break-words">
            {renderTextWithHashtags(data.postText || 'Your caption here...', 'text-[#00376b] dark:text-[#e0f1ff]')}
          </span>
        </div>

        {/* Comments */}
        {data.comments > 0 && (
          <div className={`mt-1 text-sm ${subtext}`}>
            View all {formatNumber(data.comments)} comments
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-1 pb-3 text-[10px] uppercase ${subtext}`}>
          {data.timestamp || '1 hour ago'}
        </div>
      </div>
    </div>
  );
}

function FacebookMockup({ data }: { data: MockupData }) {
  const dark = data.darkMode;
  const bg = dark ? 'bg-[#242526]' : 'bg-white';
  const text = dark ? 'text-[#e4e6eb]' : 'text-[#050505]';
  const subtext = dark ? 'text-[#b0b3b8]' : 'text-[#65676b]';
  const border = dark ? 'border-[#3e4042]' : 'border-[#ced0d4]';
  const actionBg = dark ? 'hover:bg-[#3a3b3c]' : 'hover:bg-[#f0f0f0]';

  return (
    <div className={`${bg} ${text} rounded-lg shadow-md max-w-[500px] w-full font-['Segoe_UI',_Helvetica,_Arial,_sans-serif]`}>
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-3 pb-2">
        <div className="flex gap-2.5">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-sm font-bold">
              {data.name ? getInitials(data.name) : 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[15px] leading-5">{data.name || 'User Name'}</span>
              {data.verified && (
                <BadgeCheck className="w-4 h-4 text-[#1877f2]" />
              )}
            </div>
            <div className={`flex items-center gap-1 text-[13px] ${subtext}`}>
              <span>{data.timestamp || '1h'}</span>
              <span>·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <MoreHorizontal className={`w-5 h-5 ${subtext}`} />
      </div>

      {/* Post text */}
      <div className="px-4 pb-2 text-[15px] leading-5 whitespace-pre-wrap break-words">
        {renderTextWithHashtags(data.postText || 'Your post text will appear here...', 'text-[#1877f2]')}
      </div>

      {/* Post image */}
      {data.postImageUrl && (
        <img src={data.postImageUrl} alt="" className="w-full max-h-[500px] object-cover" />
      )}

      {/* Engagement summary */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${subtext} text-[15px]`}>
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-[18px] h-[18px] rounded-full bg-[#1877f2] flex items-center justify-center border border-white">
              <ThumbsUp className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="w-[18px] h-[18px] rounded-full bg-red-500 flex items-center justify-center border border-white">
              <Heart className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          </div>
          <span className="ml-1">{data.likes > 0 ? formatNumber(data.likes) : '0'}</span>
        </div>
        <div className="flex gap-3">
          {data.comments > 0 && <span>{formatNumber(data.comments)} comments</span>}
          {data.shares > 0 && <span>{formatNumber(data.shares)} shares</span>}
        </div>
      </div>

      {/* Divider */}
      <div className={`mx-4 border-t ${border}`} />

      {/* Action buttons */}
      <div className="flex items-center px-2 py-1">
        {[
          { icon: ThumbsUp, label: 'Like' },
          { icon: MessageCircle, label: 'Comment' },
          { icon: Share, label: 'Share' },
        ].map((action) => (
          <button
            key={action.label}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md ${subtext} ${actionBg} text-[15px] font-semibold`}
          >
            <action.icon className="w-5 h-5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LinkedInMockup({ data }: { data: MockupData }) {
  const dark = data.darkMode;
  const bg = dark ? 'bg-[#1b1f23]' : 'bg-white';
  const text = dark ? 'text-[#ffffff_rgba(255,255,255,0.9)]' : 'text-[#000000_rgba(0,0,0,0.9)]';
  const mainText = dark ? 'text-white/90' : 'text-black/90';
  const subtext = dark ? 'text-white/60' : 'text-black/60';
  const border = dark ? 'border-[#38434f]' : 'border-[#e0e0e0]';
  const actionBg = dark ? 'hover:bg-white/10' : 'hover:bg-black/5';

  return (
    <div className={`${bg} ${mainText} rounded-lg ${border} border shadow-sm max-w-[552px] w-full font-[-apple-system,_BlinkMacSystemFont,_'Segoe_UI',_sans-serif]`}>
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-3 pb-2">
        <div className="flex gap-2">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#0a66c2] flex items-center justify-center text-white text-sm font-bold">
              {data.name ? getInitials(data.name) : 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm leading-5">{data.name || 'User Name'}</span>
              {data.verified && (
                <BadgeCheck className="w-4 h-4 text-[#0a66c2]" />
              )}
            </div>
            <div className={`text-xs ${subtext} leading-4 line-clamp-1`}>
              {data.handle ? `@${data.handle}` : 'Headline goes here'}
            </div>
            <div className={`flex items-center gap-1 text-xs ${subtext}`}>
              <span>{data.timestamp || '1h'}</span>
              <span>·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <MoreHorizontal className={`w-6 h-6 ${subtext}`} />
      </div>

      {/* Post text */}
      <div className="px-4 pb-2 text-sm leading-5 whitespace-pre-wrap break-words">
        {renderTextWithHashtags(data.postText || 'Your post text will appear here...', 'text-[#0a66c2] font-semibold')}
      </div>

      {/* Post image */}
      {data.postImageUrl && (
        <img src={data.postImageUrl} alt="" className="w-full max-h-[500px] object-cover" />
      )}

      {/* Engagement summary */}
      <div className={`flex items-center justify-between px-4 py-2 ${subtext} text-xs`}>
        <div className="flex items-center gap-1">
          <div className="flex -space-x-0.5">
            <div className="w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center">
              <ThumbsUp className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
              <Heart className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          </div>
          <span className="ml-1">{data.likes > 0 ? formatNumber(data.likes) : '0'}</span>
        </div>
        <div className="flex gap-2">
          {data.comments > 0 && <span>{formatNumber(data.comments)} comments</span>}
          {data.retweets > 0 && <span>{formatNumber(data.retweets)} reposts</span>}
        </div>
      </div>

      {/* Divider */}
      <div className={`mx-4 border-t ${border}`} />

      {/* Action buttons */}
      <div className="flex items-center px-2 py-1">
        {[
          { icon: ThumbsUp, label: 'Like' },
          { icon: MessageCircle, label: 'Comment' },
          { icon: Repeat2, label: 'Repost' },
          { icon: Send, label: 'Send' },
        ].map((action) => (
          <button
            key={action.label}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md ${subtext} ${actionBg} text-xs font-semibold`}
          >
            <action.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function SocialMediaPostMockupTool() {
  const [data, setData] = useState<MockupData>({ ...DEFAULT_DATA });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored) as HistoryEntry[]);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToHistory = useCallback(() => {
    if (!data.postText && !data.name) return;
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      data: { ...data },
      createdAt: Date.now(),
    };
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 5);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, [data]);

  const loadFromHistory = useCallback((entry: HistoryEntry) => {
    setData({ ...entry.data });
    setShowHistory(false);
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const update = useCallback(<K extends keyof MockupData>(key: K, value: MockupData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    update('avatarUrl', url);
  }, [update]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    update('postImageUrl', url);
  }, [update]);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    saveToHistory();
    const html2canvas = (await import('html2canvas-pro')).default;
    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = `${data.platform}-mockup-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [data.platform, saveToHistory]);

  const handleReset = useCallback(() => {
    setData({ ...DEFAULT_DATA });
  }, []);

  const handleTryExample = useCallback(() => {
    setData({ ...EXAMPLE_DATA });
  }, []);

  const charLimit = CHAR_LIMITS[data.platform];
  const charCount = data.postText.length;
  const charOver = charCount > charLimit;

  const renderPreview = () => {
    switch (data.platform) {
      case 'twitter':
        return <TwitterMockup data={data} />;
      case 'instagram':
        return <InstagramMockup data={data} />;
      case 'facebook':
        return <FacebookMockup data={data} />;
      case 'linkedin':
        return <LinkedInMockup data={data} />;
    }
  };

  // Input field styling
  const inputClass = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Privacy badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-6 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-full px-4 py-2 w-fit mx-auto"
      >
        <Shield className="w-4 h-4" />
        All processing happens in your browser
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── LEFT COLUMN: Settings ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          {/* Platform selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Platform</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {PLATFORMS.map((p) => (
                <motion.button
                  key={p.id}
                  onClick={() => update('platform', p.id)}
                  className={`relative px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                    data.platform === p.id
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {data.platform === p.id && (
                    <motion.div
                      layoutId="platformBg"
                      className={`absolute inset-0 rounded-md ${p.id === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : p.id === 'twitter' ? 'bg-black dark:bg-white dark:text-black' : p.id === 'facebook' ? 'bg-[#1877f2]' : 'bg-[#0a66c2]'}`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${data.platform === p.id && p.id === 'twitter' ? 'dark:text-black' : ''}`}>
                    {p.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Profile section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Profile</h3>

            <div className="flex gap-3">
              {/* Avatar */}
              <div className="shrink-0">
                <div
                  className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {data.avatarUrl ? (
                    <img src={data.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                {data.avatarUrl && (
                  <button
                    onClick={() => update('avatarUrl', '')}
                    className="mt-1 text-xs text-red-500 hover:underline w-full text-center"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <label className={labelClass}>Display Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <span className="flex items-center gap-1">
                      <AtSign className="w-3 h-3" /> Handle / Username
                    </span>
                  </label>
                  <input
                    type="text"
                    value={data.handle}
                    onChange={(e) => update('handle', e.target.value.replace(/^@/, ''))}
                    placeholder="johndoe"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Verified toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={data.verified}
                  onChange={(e) => update('verified', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 dark:bg-gray-600 rounded-full peer-checked:bg-blue-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-blue-500" /> Verified Badge
              </span>
            </label>
          </div>

          {/* Post content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Post Content</h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Post Text</label>
                <span className={`text-xs ${charOver ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                  {charCount}/{charLimit}
                </span>
              </div>
              <textarea
                value={data.postText}
                onChange={(e) => update('postText', e.target.value)}
                placeholder="What's on your mind? Use #hashtags for highlighting..."
                rows={4}
                className={`${inputClass} resize-none ${charOver ? 'border-red-400 focus:ring-red-500/50' : ''}`}
              />
            </div>

            {/* Image upload */}
            <div>
              <label className={labelClass}>Post Image (optional)</label>
              {data.postImageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={data.postImageUrl} alt="" className="w-full max-h-40 object-cover" />
                  <button
                    onClick={() => update('postImageUrl', '')}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                >
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-xs">Click to upload image</span>
                </button>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Timestamp */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Timestamp
                </span>
              </label>
              <input
                type="text"
                value={data.timestamp}
                onChange={(e) => update('timestamp', e.target.value)}
                placeholder="2h ago, Just now, Mar 7, 2026..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Engagement stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Engagement Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /> Likes</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={data.likes}
                  onChange={(e) => update('likes', Math.max(0, parseInt(e.target.value) || 0))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-blue-500" /> Comments</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={data.comments}
                  onChange={(e) => update('comments', Math.max(0, parseInt(e.target.value) || 0))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1">
                    <Repeat2 className="w-3 h-3 text-green-500" />
                    {data.platform === 'twitter' ? 'Retweets' : 'Reposts'}
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={data.retweets}
                  onChange={(e) => update('retweets', Math.max(0, parseInt(e.target.value) || 0))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1"><Share className="w-3 h-3 text-purple-500" /> Shares</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={data.shares}
                  onChange={(e) => update('shares', Math.max(0, parseInt(e.target.value) || 0))}
                  className={inputClass}
                />
              </div>
              {data.platform === 'twitter' && (
                <div className="col-span-2">
                  <label className={labelClass}>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-gray-500" /> Views</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={data.views}
                    onChange={(e) => update('views', Math.max(0, parseInt(e.target.value) || 0))}
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTryExample}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <Sparkles className="w-4 h-4" />
              Try Example
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative"
            >
              <History className="w-4 h-4" />
              History
              {history.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </motion.button>
          </div>

          {/* History panel */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Recent Mockups</h3>
                  {history.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No saved mockups yet. Download a mockup to save it here.</p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2"
                        >
                          <button
                            onClick={() => loadFromHistory(entry)}
                            className="flex-1 text-left"
                          >
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
                              {entry.data.name || 'Untitled'} - {PLATFORMS.find((p) => p.id === entry.data.platform)?.label}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(entry.createdAt).toLocaleString()}
                            </div>
                          </button>
                          <button
                            onClick={() => deleteFromHistory(entry.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── RIGHT COLUMN: Preview ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Preview controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Live Preview</h3>
            <div className="flex items-center gap-3">
              {/* Dark mode toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {data.darkMode ? 'Dark' : 'Light'}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={data.darkMode}
                    onChange={(e) => update('darkMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 dark:bg-gray-600 rounded-full peer-checked:bg-gray-800 transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4 flex items-center justify-center">
                    {data.darkMode ? (
                      <Moon className="w-2.5 h-2.5 text-gray-700" />
                    ) : (
                      <Sun className="w-2.5 h-2.5 text-yellow-500" />
                    )}
                  </div>
                </div>
              </label>

              {/* Download */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </motion.button>
            </div>
          </div>

          {/* Preview container */}
          <div className={`rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-start justify-center min-h-[400px] ${
            data.darkMode ? 'bg-[#15202b]' : 'bg-[#f7f9fa]'
          }`}>
            <div ref={previewRef} className="w-full flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={data.platform}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex justify-center"
                >
                  {renderPreview()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-4">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Tips</h4>
            <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
              <li>-- Use #hashtags in your text to highlight them automatically</li>
              <li>-- Upload a profile picture for a more realistic mockup</li>
              <li>-- Toggle dark/light mode to match the platform theme you want</li>
              <li>-- The "Try Example" button loads a pre-filled Twitter/X post</li>
              <li>-- Downloads are saved to your history (last 5 mockups)</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
