'use client';

import { useState, useEffect, useCallback } from 'react';

interface EncryptedNote {
  id: string;
  title: string;
  iv: string;
  salt: string;
  ciphertext: string;
  createdAt: number;
  updatedAt: number;
}

interface DecryptedNote {
  id: string;
  title: string;
  body: string;
}

const STORAGE_KEY = 'secure-notes-data';

function ab2b64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function b64toAb(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function deriveKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptNote(title: string, body: string, password: string): Promise<EncryptedNote> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt.buffer);
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(body));
  return {
    id: crypto.randomUUID(),
    title,
    iv: ab2b64(iv.buffer),
    salt: ab2b64(salt.buffer),
    ciphertext: ab2b64(ciphertext),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

async function decryptNote(note: EncryptedNote, password: string): Promise<string> {
  const salt = b64toAb(note.salt);
  const iv = b64toAb(note.iv);
  const ciphertext = b64toAb(note.ciphertext);
  const key = await deriveKey(password, salt);
  const dec = new TextDecoder();
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, key, ciphertext);
  return dec.decode(plain);
}

function loadNotes(): EncryptedNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: EncryptedNote[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

type View = 'list' | 'create' | 'view';

export function SecureNotesTool() {
  const [notes, setNotes] = useState<EncryptedNote[]>([]);
  const [view, setView] = useState<View>('list');

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirm, setNewConfirm] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  // View/decrypt state
  const [selectedNote, setSelectedNote] = useState<EncryptedNote | null>(null);
  const [viewPassword, setViewPassword] = useState('');
  const [decrypted, setDecrypted] = useState<DecryptedNote | null>(null);
  const [viewError, setViewError] = useState('');
  const [decrypting, setDecrypting] = useState(false);

  // Session password memory
  const [sessionPassword, setSessionPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const handleCreate = useCallback(async () => {
    setCreateError('');
    if (!newTitle.trim()) { setCreateError('Title is required.'); return; }
    if (!newBody.trim()) { setCreateError('Note body is required.'); return; }
    if (!newPassword) { setCreateError('Password is required.'); return; }
    if (newPassword !== newConfirm) { setCreateError('Passwords do not match.'); return; }
    setCreating(true);
    try {
      const encrypted = await encryptNote(newTitle.trim(), newBody.trim(), newPassword);
      const updated = [encrypted, ...notes];
      setNotes(updated);
      saveNotes(updated);
      if (rememberSession) setSessionPassword(newPassword);
      setNewTitle('');
      setNewBody('');
      setNewPassword('');
      setNewConfirm('');
      setView('list');
    } catch {
      setCreateError('Encryption failed. Please try again.');
    } finally {
      setCreating(false);
    }
  }, [newTitle, newBody, newPassword, newConfirm, notes, rememberSession]);

  const handleViewNote = useCallback((note: EncryptedNote) => {
    setSelectedNote(note);
    setDecrypted(null);
    setViewError('');
    setViewPassword(sessionPassword);
    setView('view');
  }, [sessionPassword]);

  const handleDecrypt = useCallback(async () => {
    if (!selectedNote) return;
    setViewError('');
    setDecrypting(true);
    try {
      const body = await decryptNote(selectedNote, viewPassword);
      setDecrypted({ id: selectedNote.id, title: selectedNote.title, body });
      if (rememberSession) setSessionPassword(viewPassword);
    } catch {
      setViewError('Wrong password or corrupted note.');
    } finally {
      setDecrypting(false);
    }
  }, [selectedNote, viewPassword, rememberSession]);

  const handleDelete = useCallback((id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
    setDeleteId(null);
    if (view === 'view') setView('list');
  }, [notes, view]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secure-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [notes]);

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
        <span className="text-blue-500 mt-0.5">🔒</span>
        <p>All encryption happens in your browser using AES-256 (Web Crypto API). Your notes and passwords <strong>never leave this device</strong>.</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {view === 'list' ? 'My Secure Notes' : view === 'create' ? 'New Note' : 'View Note'}
        </h2>
        <div className="flex gap-2">
          {view === 'list' && (
            <>
              {notes.length > 0 && (
                <button onClick={handleExport} className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                  Export JSON
                </button>
              )}
              <button onClick={() => { setView('create'); setCreateError(''); }} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                + New Note
              </button>
            </>
          )}
          {view !== 'list' && (
            <button onClick={() => { setView('list'); setDecrypted(null); setViewError(''); }} className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-2">
          {notes.length === 0 && (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <div className="text-4xl mb-3">🔐</div>
              <p className="font-medium">No notes yet</p>
              <p className="text-sm mt-1">Create your first encrypted note</p>
            </div>
          )}
          {notes.map(note => (
            <div key={note.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
              <button onClick={() => handleViewNote(note)} className="flex-1 text-left">
                <p className="font-medium text-slate-900 dark:text-slate-100">{note.title}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Created {formatDate(note.createdAt)} · Encrypted</p>
              </button>
              <div className="flex items-center gap-2 ml-3">
                <button onClick={() => handleViewNote(note)} className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50">
                  Open
                </button>
                <button onClick={() => setDeleteId(note.id)} className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create View */}
      {view === 'create' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Note Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="My private note"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Note Content</label>
            <textarea
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              placeholder="Write your private note here..."
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Encryption Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Strong password"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                value={newConfirm}
                onChange={e => setNewConfirm(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember-session"
              checked={rememberSession}
              onChange={e => setRememberSession(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="remember-session" className="text-sm text-slate-600 dark:text-slate-400">Remember password for this session</label>
          </div>
          {createError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{createError}</p>}
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? 'Encrypting...' : 'Encrypt & Save Note'}
          </button>
        </div>
      )}

      {/* View/Decrypt View */}
      {view === 'view' && selectedNote && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedNote.title}</h3>
            <button onClick={() => setDeleteId(selectedNote.id)} className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400">Delete note</button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Created {formatDate(selectedNote.createdAt)}</p>

          {!decrypted ? (
            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                This note is encrypted. Enter your password to view it.
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={viewPassword}
                  onChange={e => setViewPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleDecrypt()}
                  placeholder="Enter encryption password"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember-session-view"
                  checked={rememberSession}
                  onChange={e => setRememberSession(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="remember-session-view" className="text-sm text-slate-600 dark:text-slate-400">Remember for this session</label>
              </div>
              {viewError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{viewError}</p>}
              <button
                onClick={handleDecrypt}
                disabled={decrypting || !viewPassword}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {decrypting ? 'Decrypting...' : 'Unlock Note'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">Decrypted successfully</p>
                <pre className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">{decrypted.body}</pre>
              </div>
              <button onClick={() => { setDecrypted(null); setViewPassword(''); }} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                Lock note
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Delete Note?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">This action cannot be undone. The encrypted note will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
