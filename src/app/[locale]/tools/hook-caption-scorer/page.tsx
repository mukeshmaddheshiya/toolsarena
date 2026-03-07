import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HookCaptionScorerTool } from './HookCaptionScorerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('hook-caption-scorer')!);
}

export default function Page() {
  return <ToolPageWrapper slug="hook-caption-scorer"><HookCaptionScorerTool /></ToolPageWrapper>;
}
