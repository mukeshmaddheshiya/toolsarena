import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AffidavitGeneratorTool } from './AffidavitGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('affidavit-generator')!);
}

export default function Page() {
  return <ToolPageWrapper slug="affidavit-generator"><AffidavitGeneratorTool /></ToolPageWrapper>;
}
