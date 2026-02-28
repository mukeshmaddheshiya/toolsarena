import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About ToolsArena - Free Online Tools Platform',
  description: 'Learn about ToolsArena, a free online tools platform built for students, developers, and professionals. No signup, no ads in tools, 100% private.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-6">About ToolsArena</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>ToolsArena is a free, all-in-one micro-tools platform built for students, developers, freelancers, and anyone who needs quick, reliable online utilities. We believe powerful tools should be accessible to everyone &mdash; no signup, no premium paywalls, no annoying ads in the middle of your work.</p>
        <p>Every tool on ToolsArena runs entirely in your browser. Your files, text, and data never leave your device and are never sent to our servers. This makes ToolsArena the most private online tools platform available.</p>
        <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">Our Mission</h2>
        <p>To make every digital task simpler. Whether you need to compress an image for your blog, calculate your home loan EMI, format messy JSON, or generate a QR code for your business card &mdash; ToolsArena has you covered with fast, reliable, privacy-first tools.</p>
        <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">Why ToolsArena?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>100% Free:</strong> All tools are completely free with no hidden costs.</li>
          <li><strong>Privacy First:</strong> All processing happens in your browser &mdash; nothing is uploaded.</li>
          <li><strong>No Signup:</strong> Use any tool instantly without creating an account.</li>
          <li><strong>Fast &amp; Reliable:</strong> Built with Next.js for lightning-fast performance.</li>
          <li><strong>Made in India:</strong> Built with love in India for the global audience.</li>
        </ul>
        <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">Contact</h2>
        <p>Have a suggestion for a new tool or found a bug? We&apos;d love to hear from you. <a href="/contact" className="text-primary-700 dark:text-primary-400 hover:underline">Contact us here</a>.</p>
      </div>
    </div>
  );
}
