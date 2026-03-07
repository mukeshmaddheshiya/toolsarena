import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AtsResumeCheckerTool } from './AtsResumeCheckerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ats-resume-checker')!);
}

export default function Page() {
  return <ToolPageWrapper slug="ats-resume-checker"><AtsResumeCheckerTool /></ToolPageWrapper>;
}
