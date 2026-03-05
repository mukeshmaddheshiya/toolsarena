'use client';
import { useState } from 'react';
import { Mail, Send, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdalvwao';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const t = useTranslations('contact');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('title')}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">{t('subtitle')}</p>

      {status === 'sent' ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Send className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-heading font-bold text-green-800 dark:text-green-300 mb-1">{t('successTitle')}</h2>
          <p className="text-sm text-green-600 dark:text-green-400">{t('successText')}</p>
          <button onClick={() => setStatus('idle')} className="mt-4 text-xs text-primary-600 dark:text-primary-400 underline">{t('sendAnother')}</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('nameLabel')}</label>
              <input
                id="contact-name"
                name="name"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
                placeholder={t('namePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('emailLabel')}</label>
              <input
                id="contact-email"
                name="email"
                required
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('subjectLabel')}</label>
            <input
              id="contact-subject"
              name="subject"
              required
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
              placeholder={t('subjectPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('messageLabel')}</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="tool-textarea"
              placeholder={t('messagePlaceholder')}
            />
          </div>
          {status === 'error' && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2.5">
              {t('errorText')}
            </p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-800 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {status === 'sending'
              ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('sending')}</>
              : <><Send className="w-4 h-4" /> {t('sendButton')}</>
            }
          </button>
        </form>
      )}

      <div className="mt-8 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <Mail className="w-4 h-4" />
        <span>{t('emailDirect')} <a href="mailto:hello@toolsarena.in" className="text-primary-700 dark:text-primary-400 hover:underline">hello@toolsarena.in</a></span>
      </div>
    </div>
  );
}
