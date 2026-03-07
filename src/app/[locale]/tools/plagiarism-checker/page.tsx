import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PlagiarismCheckerTool } from './PlagiarismCheckerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('plagiarism-checker')!);
}

export default function Page() {
  return <ToolPageWrapper slug="plagiarism-checker"><PlagiarismCheckerTool /></ToolPageWrapper>;
}
