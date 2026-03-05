import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CharacterCounterTool } from './CharacterCounterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('character-counter')!);
}
export default function CharacterCounterPage() {
  return <ToolPageWrapper slug="character-counter"><CharacterCounterTool /></ToolPageWrapper>;
}
