import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HtmlToPdfTool } from './HtmlToPdfTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('html-to-pdf')!);
}
export default function HtmlToPdfPage() {
  return <ToolPageWrapper slug="html-to-pdf"><HtmlToPdfTool /></ToolPageWrapper>;
}
