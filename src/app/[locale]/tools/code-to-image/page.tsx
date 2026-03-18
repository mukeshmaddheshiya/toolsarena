import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CodeToImageTool } from './CodeToImageTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('code-to-image')!);
}
export default function CodeToImagePage() {
  return <ToolPageWrapper slug="code-to-image"><CodeToImageTool /></ToolPageWrapper>;
}
