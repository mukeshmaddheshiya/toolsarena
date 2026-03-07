import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BioLinkGeneratorTool } from './BioLinkGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('bio-link-generator')!);
}

export default function Page() {
  return <ToolPageWrapper slug="bio-link-generator"><BioLinkGeneratorTool /></ToolPageWrapper>;
}
