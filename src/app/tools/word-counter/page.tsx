import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WordCounterTool } from './WordCounterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('word-counter')!);
}
export default function WordCounterPage() {
  return <ToolPageWrapper slug="word-counter"><WordCounterTool /></ToolPageWrapper>;
}
