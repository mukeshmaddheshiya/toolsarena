import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ResumeBuilderTool } from './ResumeBuilderTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('resume-builder')!);
}
export default function ResumeBuilderPage() {
  return <ToolPageWrapper slug="resume-builder"><ResumeBuilderTool /></ToolPageWrapper>;
}
