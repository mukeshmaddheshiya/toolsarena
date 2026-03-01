import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MarkdownToHtmlTool } from './MarkdownToHtmlTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('markdown-to-html')!); }
export default function MarkdownToHtmlPage() { return <ToolPageWrapper slug="markdown-to-html"><MarkdownToHtmlTool /></ToolPageWrapper>; }
