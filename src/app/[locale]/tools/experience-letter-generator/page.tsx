import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ExperienceLetterGeneratorTool } from './ExperienceLetterGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('experience-letter-generator')!);
}

export default function Page() {
  return <ToolPageWrapper slug="experience-letter-generator"><ExperienceLetterGeneratorTool /></ToolPageWrapper>;
}
