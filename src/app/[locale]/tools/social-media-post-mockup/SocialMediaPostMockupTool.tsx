'use client';

import { useState, useRef } from 'react';
import { Download, Heart, MessageCircle, Share2, ThumbsUp, Repeat2, Bookmark } from 'lucide-react';

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin';

interface PostData {
  platform: Platform;
  profileName: string;
  handle: string;
  avatarLetter: string;
  avatarColor: string;
  postText: string;
  imageUrl: string;
  likes: number;
  comments: number;
  shares: number;
}

const PLATFORM_LIMITS: Record<Platform, number> = {
  twitter: 280,
  facebook: 3000,
  instagram: 2200,
  linkedin: 3000,
};

const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
};

const AVATAR_COLORS = [
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Green', value: 'bg-green-500' },
  { label: 'Red', value: 'bg-red-500' },
  { label: 'Orange', value: 'bg-orange-500' },
  { label: 'Pink', value: 'bg-pink-500' },
  { label: 'Teal', value: 'bg-teal-500' },
  { label: 'Gray', value: 'bg-gray-500' },
];

// Platform header colors for brand recognition
const PLATFORM_HEADER: Record<Platform, string> = {
  facebook: 'bg-[#1877F2]',
  instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400',
  twitter: 'bg-black',
  linkedin: 'bg-[#0A66C2]',
};

const PLATFORM_ACCENT: Record<Platform, string> = {
  facebook: 'text-[#1877F2]',
  instagram: 'text-pink-600',
  twitter: 'text-black',
  linkedin: 'text-[#0A66C2]',
};

function FacebookMockup({ data }: { data: PostData }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-lg font-sans">
      {/* FB top bar */}
      <div className="bg-[#1877F2] px-4 py-2 flex items-center gap-2">
        <span className="text-white font-bold text-lg">f</span>
        <div className="flex-1 bg-white bg-opacity-20 rounded-full px-3 py-1">
          <span className="text-white text-xs opacity-70">Search Facebook</span>
        </div>
      </div>
      {/* Post */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full ${data.avatarColor} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-lg">{data.avatarLetter || 'U'}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{data.profileName || 'Your Name'}</p>
            <p className="text-xs text-gray-500">Just now · Public</p>
          </div>
          <div className="ml-auto text-gray-400 text-lg">···</div>
        </div>
        {data.postText && (
          <p className="text-gray-800 text-sm mb-3 whitespace-pre-wrap leading-relaxed">{data.postText}</p>
        )}
        {data.imageUrl && (
          <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
            <img src={data.imageUrl} alt="Post" className="w-full object-cover max-h-64" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-2 mb-2">
          <span>👍 {data.likes.toLocaleString()} Likes</span>
          <span>{data.comments} comments · {data.shares} shares</span>
        </div>
        <div className="flex items-center justify-around">
          {[
            { icon: ThumbsUp, label: 'Like' },
            { icon: MessageCircle, label: 'Comment' },
            { icon: Share2, label: 'Share' },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="flex items-center gap-1.5 text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InstagramMockup({ data }: { data: PostData }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden max-w-sm font-sans">
      {/* IG header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${data.avatarColor} flex items-center justify-center ring-2 ring-pink-500 ring-offset-1`}>
            <span className="text-white font-bold text-sm">{data.avatarLetter || 'U'}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{data.profileName || 'yourhandle'}</p>
            {data.handle && <p className="text-xs text-gray-400">@{data.handle}</p>}
          </div>
        </div>
        <span className="text-gray-400 text-lg">···</span>
      </div>
      {/* Image */}
      {data.imageUrl ? (
        <img src={data.imageUrl} alt="Post" className="w-full aspect-square object-cover bg-gray-100" onError={e => { (e.target as HTMLImageElement).src = ''; }} />
      ) : (
        <div className="w-full aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center">
          <span className="text-gray-300 text-sm">No image</span>
        </div>
      )}
      {/* Actions */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-gray-800 hover:text-red-500 cursor-pointer" />
            <MessageCircle className="w-6 h-6 text-gray-800 cursor-pointer" />
            <Share2 className="w-6 h-6 text-gray-800 cursor-pointer" />
          </div>
          <Bookmark className="w-6 h-6 text-gray-800 cursor-pointer" />
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">{data.likes.toLocaleString()} likes</p>
        {data.postText && (
          <p className="text-sm text-gray-800 leading-snug">
            <span className="font-semibold mr-1">{data.profileName || 'yourhandle'}</span>
            <span className="whitespace-pre-wrap">{data.postText.slice(0, 120)}{data.postText.length > 120 ? '... more' : ''}</span>
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">View all {data.comments} comments</p>
        <p className="text-xs text-gray-300 mt-1 uppercase tracking-wide">Just now</p>
      </div>
    </div>
  );
}

function TwitterMockup({ data }: { data: PostData }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden max-w-md font-sans">
      <div className="p-4">
        <div className="flex gap-3">
          <div className={`w-10 h-10 rounded-full ${data.avatarColor} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold">{data.avatarLetter || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-gray-900 text-sm">{data.profileName || 'Your Name'}</span>
              <span className="text-gray-500 text-sm">@{data.handle || 'handle'}</span>
              <span className="text-gray-400 text-sm">· Just now</span>
            </div>
            {data.postText && (
              <p className="text-gray-900 text-sm mt-1 mb-2 whitespace-pre-wrap leading-relaxed">{data.postText}</p>
            )}
            {data.imageUrl && (
              <div className="mb-3 rounded-2xl overflow-hidden border border-gray-200">
                <img src={data.imageUrl} alt="Post" className="w-full object-cover max-h-56" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <div className="flex items-center justify-between text-gray-500 mt-2 max-w-xs">
              <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer text-xs">
                <MessageCircle className="w-4 h-4" /> {data.comments}
              </span>
              <span className="flex items-center gap-1 hover:text-green-500 cursor-pointer text-xs">
                <Repeat2 className="w-4 h-4" /> {data.shares}
              </span>
              <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer text-xs">
                <Heart className="w-4 h-4" /> {data.likes}
              </span>
              <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer text-xs">
                <Bookmark className="w-4 h-4" />
              </span>
              <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer text-xs">
                <Share2 className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkedInMockup({ data }: { data: PostData }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden max-w-lg font-sans">
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <div className={`w-12 h-12 rounded-full ${data.avatarColor} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-lg">{data.avatarLetter || 'U'}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{data.profileName || 'Your Name'}</p>
            <p className="text-xs text-gray-500">{data.handle ? `@${data.handle}` : 'Professional Title'}</p>
            <p className="text-xs text-gray-400">Just now · Public</p>
          </div>
          <button className="ml-auto text-[#0A66C2] text-sm font-semibold border border-[#0A66C2] px-3 py-1 rounded-full hover:bg-blue-50">
            + Follow
          </button>
        </div>
        {data.postText && (
          <p className="text-gray-800 text-sm mb-3 whitespace-pre-wrap leading-relaxed">{data.postText}</p>
        )}
        {data.imageUrl && (
          <div className="mb-3 overflow-hidden bg-gray-100">
            <img src={data.imageUrl} alt="Post" className="w-full object-cover max-h-64" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>👍 {data.likes.toLocaleString()} reactions</span>
          <span>{data.comments} comments · {data.shares} reposts</span>
        </div>
        <div className="border-t border-gray-100 pt-2 flex items-center justify-around">
          {[
            { icon: ThumbsUp, label: 'Like' },
            { icon: MessageCircle, label: 'Comment' },
            { icon: Repeat2, label: 'Repost' },
            { icon: Share2, label: 'Send' },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SocialMediaPostMockupTool() {
  const mockupRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [data, setData] = useState<PostData>({
    platform: 'twitter',
    profileName: 'John Smith',
    handle: 'johnsmith',
    avatarLetter: 'J',
    avatarColor: 'bg-blue-500',
    postText: '',
    imageUrl: '',
    likes: 42,
    comments: 8,
    shares: 5,
  });

  function update<K extends keyof PostData>(key: K, value: PostData[K]) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  async function downloadPng() {
    if (!mockupRef.current) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(mockupRef.current, {
        scale: 2,
        backgroundColor: '#f9fafb',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${data.platform}-post-mockup.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Download failed. Please try again or take a screenshot manually.');
    } finally {
      setIsDownloading(false);
    }
  }

  const charLimit = PLATFORM_LIMITS[data.platform];
  const charCount = data.postText.length;
  const charRemaining = charLimit - charCount;
  const isOverLimit = charRemaining < 0;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-pink-100 rounded-lg">
          <Share2 className="w-5 h-5 text-pink-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Social Media Post Mockup</h2>
          <p className="text-xs text-gray-500">Design and preview posts before publishing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Platform selector */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {(['facebook', 'instagram', 'twitter', 'linkedin'] as Platform[]).map(p => (
                <button
                  key={p}
                  onClick={() => update('platform', p)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    data.platform === p
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Profile */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Profile</label>
            <input
              type="text"
              placeholder="Display name"
              value={data.profileName}
              onChange={e => update('profileName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Handle / username (without @)"
              value={data.handle}
              onChange={e => update('handle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Avatar Letter</label>
                <input
                  type="text"
                  maxLength={1}
                  placeholder="A"
                  value={data.avatarLetter}
                  onChange={e => update('avatarLetter', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-center"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Avatar Color</label>
                <select
                  value={data.avatarColor}
                  onChange={e => update('avatarColor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {AVATAR_COLORS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Post content */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-800">Post Text</label>
              <span className={`text-xs font-medium ${isOverLimit ? 'text-red-500' : charRemaining < 20 ? 'text-yellow-500' : 'text-gray-400'}`}>
                {charRemaining < 0 ? charRemaining : charRemaining} chars left
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="What's on your mind?"
              value={data.postText}
              onChange={e => update('postText', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none ${
                isOverLimit ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
              }`}
            />
            <input
              type="url"
              placeholder="Optional image URL (https://...)"
              value={data.imageUrl}
              onChange={e => update('imageUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Engagement numbers */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Engagement Counts</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Likes', key: 'likes' as const, icon: Heart },
                { label: 'Comments', key: 'comments' as const, icon: MessageCircle },
                { label: 'Shares', key: 'shares' as const, icon: Share2 },
              ].map(({ label, key, icon: Icon }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Icon className="w-3 h-3" /> {label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={data[key]}
                    onChange={e => update(key, parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={downloadPng}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Generating...' : 'Download as PNG'}
          </button>
        </div>

        {/* Mockup preview */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Preview</p>
          <div ref={mockupRef} className="bg-gray-50 rounded-2xl p-6 flex items-start justify-center min-h-64">
            {data.platform === 'facebook' && <FacebookMockup data={data} />}
            {data.platform === 'instagram' && <InstagramMockup data={data} />}
            {data.platform === 'twitter' && <TwitterMockup data={data} />}
            {data.platform === 'linkedin' && <LinkedInMockup data={data} />}
          </div>
          <p className="text-xs text-center text-gray-400">
            Mockups are for design purposes only. Not affiliated with any social media platform.
          </p>
        </div>
      </div>
    </div>
  );
}
