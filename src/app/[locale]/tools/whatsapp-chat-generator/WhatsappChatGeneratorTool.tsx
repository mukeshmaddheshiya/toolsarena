'use client';

import { useState, useRef, useCallback, useId } from 'react';

type TickType = 'single' | 'double' | 'blue';

interface ChatMessage {
  id: string;
  sender: 'A' | 'B';
  text: string;
  time: string;
  tick: TickType;
}

interface ChatConfig {
  nameA: string;
  nameB: string;
  colorA: string;
  statusA: 'online' | 'offline' | 'typing';
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

const TICK_ICONS: Record<TickType, { svg: string; label: string }> = {
  single: {
    label: 'Sent',
    svg: `<svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 5L5 9L15 1" stroke="#8B9DAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
  },
  double: {
    label: 'Delivered',
    svg: `<svg width="18" height="10" viewBox="0 0 18 10" fill="none"><path d="M1 5L5 9L15 1" stroke="#8B9DAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 5L9 9L17 1" stroke="#8B9DAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
  },
  blue: {
    label: 'Read',
    svg: `<svg width="18" height="10" viewBox="0 0 18 10" fill="none"><path d="M1 5L5 9L15 1" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 5L9 9L17 1" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
  },
};

function TickIcon({ type }: { type: TickType }) {
  if (type === 'single') {
    return (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="inline-block ml-1">
        <path d="M1 5L5 9L15 1" stroke="#8B9DAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'double') {
    return (
      <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="inline-block ml-1">
        <path d="M1 5L5 9L13 1" stroke="#8B9DAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 5L10 9L18 1" stroke="#8B9DAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="inline-block ml-1">
      <path d="M1 5L5 9L13 1" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5L10 9L18 1" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STATUS_COLORS: Record<string, string> = {
  online: 'text-green-400',
  offline: 'text-gray-400',
  typing: 'text-green-300',
};

const STATUS_LABELS: Record<string, string> = {
  online: 'online',
  offline: 'last seen recently',
  typing: 'typing...',
};

export function WhatsappChatGeneratorTool() {
  const [config, setConfig] = useState<ChatConfig>({
    nameA: 'Rohit',
    nameB: 'You',
    colorA: '#FF5733',
    statusA: 'online',
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: generateId(), sender: 'A', text: 'Hey! Are you coming tomorrow? 😊', time: '10:30', tick: 'blue' },
    { id: generateId(), sender: 'B', text: 'Yes! What time? 🎉', time: '10:32', tick: 'blue' },
    { id: generateId(), sender: 'A', text: 'Around 6 PM at the usual place.', time: '10:33', tick: 'double' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [newSender, setNewSender] = useState<'A' | 'B'>('B');
  const [newTime, setNewTime] = useState(getCurrentTime());
  const [useAutoTime, setUseAutoTime] = useState(true);
  const [newTick, setNewTick] = useState<TickType>('blue');
  const chatRef = useRef<HTMLDivElement>(null);

  const handleAddMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: generateId(),
      sender: newSender,
      text: newMessage.trim(),
      time: useAutoTime ? getCurrentTime() : newTime,
      tick: newTick,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMove = (id: string, dir: 'up' | 'down') => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (dir === 'up' && idx === 0) return prev;
      if (dir === 'down' && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Print-only styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          .whatsapp-preview-print { display: block !important; position: fixed; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        @media screen {
          .whatsapp-preview-print { display: block; }
        }
      `}</style>

      <div className="text-center space-y-2 no-print">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">WhatsApp Chat Generator</h1>
        <p className="text-gray-500 text-sm">Create a realistic WhatsApp chat for demos, presentations, or fun.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5 no-print">
          {/* Config */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Chat Settings</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Contact Name (Person A)</label>
                <input
                  type="text"
                  value={config.nameA}
                  onChange={(e) => setConfig((p) => ({ ...p, nameA: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={30}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Your Name (Person B)</label>
                <input
                  type="text"
                  value={config.nameB}
                  onChange={(e) => setConfig((p) => ({ ...p, nameB: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={30}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Avatar Color (A)</label>
                <input
                  type="color"
                  value={config.colorA}
                  onChange={(e) => setConfig((p) => ({ ...p, colorA: e.target.value }))}
                  className="h-9 w-16 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
                <select
                  value={config.statusA}
                  onChange={(e) => setConfig((p) => ({ ...p, statusA: e.target.value as ChatConfig['statusA'] }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="online">Online</option>
                  <option value="offline">Last seen recently</option>
                  <option value="typing">Typing...</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add Message */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Add Message</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sender</label>
                <select
                  value={newSender}
                  onChange={(e) => setNewSender(e.target.value as 'A' | 'B')}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="A">A — {config.nameA}</option>
                  <option value="B">B — {config.nameB} (You)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {newSender === 'B' ? 'Tick Mark' : 'Time'}
                </label>
                {newSender === 'B' ? (
                  <select
                    value={newTick}
                    onChange={(e) => setNewTick(e.target.value as TickType)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="single">✓ Sent</option>
                    <option value="double">✓✓ Delivered</option>
                    <option value="blue">✓✓ Read (blue)</option>
                  </select>
                ) : (
                  <span className="block text-xs text-gray-400 py-2">N/A for Person A</span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Time</label>
                <label className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useAutoTime}
                    onChange={(e) => setUseAutoTime(e.target.checked)}
                    className="accent-green-600"
                  />
                  Auto (current time)
                </label>
              </div>
              {!useAutoTime && (
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddMessage();
                  }
                }}
                placeholder="Type a message... (emoji supported 😊)"
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Press Enter to add, Shift+Enter for new line.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddMessage}
                disabled={!newMessage.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Add Message
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              Print / Save as PDF
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Tip: In the print dialog, choose "Save as PDF" and set margins to None for a clean screenshot.
          </p>
        </div>

        {/* WhatsApp Preview */}
        <div className="whatsapp-preview-print">
          <div
            ref={chatRef}
            className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
            style={{ maxWidth: 420, margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
          >
            {/* WhatsApp Header */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#075E54' }}>
              <svg className="w-5 h-5 text-white opacity-80 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: config.colorA }}
              >
                {getInitial(config.nameA)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight truncate">{config.nameA || 'Contact'}</p>
                <p className={`text-xs leading-tight ${STATUS_COLORS[config.statusA]}`}>
                  {STATUS_LABELS[config.statusA]}
                </p>
              </div>
              <div className="flex items-center gap-4 opacity-80">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            </div>

            {/* Chat Body */}
            <div
              className="px-3 py-4 space-y-1 min-h-80 max-h-128 overflow-y-auto"
              style={{ background: '#ECE5DD', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4c5b2\' fill-opacity=\'0.3\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
            >
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No messages yet. Add some above!
                </div>
              )}
              {messages.map((msg, idx) => {
                const isB = msg.sender === 'B';
                return (
                  <div key={msg.id} className={`flex ${isB ? 'justify-end' : 'justify-start'} group`}>
                    <div className="relative max-w-xs">
                      <div
                        className="px-3 pt-2 pb-1.5 rounded-lg shadow-sm text-sm relative"
                        style={{
                          background: isB ? '#DCF8C6' : '#FFFFFF',
                          borderTopLeftRadius: !isB ? 0 : undefined,
                          borderTopRightRadius: isB ? 0 : undefined,
                          minWidth: 60,
                        }}
                      >
                        {!isB && (
                          <p className="text-xs font-semibold mb-0.5" style={{ color: config.colorA }}>
                            {config.nameA}
                          </p>
                        )}
                        <p className="text-gray-800 leading-snug whitespace-pre-wrap break-words">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-gray-400 text-xs">{msg.time}</span>
                          {isB && <TickIcon type={msg.tick} />}
                        </div>
                      </div>
                      <div className="no-print absolute -top-7 right-0 hidden group-hover:flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-md px-1.5 py-0.5">
                        <button
                          onClick={() => handleMove(msg.id, 'up')}
                          disabled={idx === 0}
                          className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMove(msg.id, 'down')}
                          disabled={idx === messages.length - 1}
                          className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                          title="Move down"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-0.5 text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar (decorative) */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 border-t border-gray-200">
              <div className="flex-1 bg-white rounded-full px-4 py-2 text-gray-400 text-sm border border-gray-200">
                Type a message
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#075E54' }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
