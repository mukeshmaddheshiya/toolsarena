import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LegalNoticeGeneratorTool } from './LegalNoticeGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('legal-notice-generator')!);
}

export default function Page() {
  return <ToolPageWrapper slug="legal-notice-generator"><LegalNoticeGeneratorTool /></ToolPageWrapper>;
}
