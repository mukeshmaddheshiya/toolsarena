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
            <p className="text-xs text-slate-500">Made with ❤️ in India</p>
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
