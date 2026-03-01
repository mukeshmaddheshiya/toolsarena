import Link from 'next/link';
import { Zap } from 'lucide-react';
import { tools, categories } from '@/lib/tools-registry';
import type { ToolCategory } from '@/types/tools';

const FOOTER_CATEGORIES: ToolCategory[] = ['image-tools', 'pdf-tools', 'text-tools', 'calculators', 'developer-tools', 'converters'];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl text-white mb-3">
              <span className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </span>
              ToolsArena
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Free online tools for everyone. No signup, no downloads, privacy-first.
            </p>
            <div className="border-t border-slate-800 pt-3 mt-3">
              <p className="text-xs text-slate-400 font-medium mb-1">Built by</p>
              <a href="https://mukesh-portfolio-zeta.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-primary-400 transition-colors">
                Mukesh Maddheshiya
              </a>
              <p className="text-xs text-slate-500 mb-2">Founder &amp; Developer</p>
              <div className="flex items-center gap-3">
                <a href="https://www.linkedin.com/in/mukesh-maddheshiya-76a83b193" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://www.instagram.com/mukeshmaddy7/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://mukesh-portfolio-zeta.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Portfolio">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                </a>
                <a href="mailto:Mukeshdr005@gmail.com" className="text-slate-400 hover:text-white transition-colors" aria-label="Email">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
                </a>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Made with ❤️ in India</p>
          </div>

          {/* Category links */}
          {FOOTER_CATEGORIES.map(catKey => {
            const cat = categories[catKey];
            const catTools = tools.filter(t => t.category === catKey).slice(0, 6);
            return (
              <div key={catKey}>
                <Link href={`/category/${catKey}`} className="font-semibold text-white text-sm mb-3 block hover:text-primary-400 transition-colors">
                  {cat.name}
                </Link>
                <ul className="space-y-2">
                  {catTools.map(tool => (
                    <li key={tool.slug}>
                      <Link href={`/tools/${tool.slug}`} className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ToolsArena. All rights reserved.
          </p>
          <nav className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/about" className="hover:text-slate-200 transition-colors">About</Link>
            <Link href="/privacy-policy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-200 transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
