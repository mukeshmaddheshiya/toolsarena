import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SocialMediaBioGeneratorTool } from './SocialMediaBioGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('social-media-bio-generator')!);
}

export default function Page() {
  return <ToolPageWrapper slug="social-media-bio-generator"><SocialMediaBioGeneratorTool /></ToolPageWrapper>;
}
