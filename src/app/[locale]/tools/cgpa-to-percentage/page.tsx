import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CgpaToPercentageTool } from './CgpaToPercentageTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('cgpa-to-percentage')!);
}
export default function CgpaToPercentagePage() {
  return <ToolPageWrapper slug="cgpa-to-percentage"><CgpaToPercentageTool /></ToolPageWrapper>;
}
