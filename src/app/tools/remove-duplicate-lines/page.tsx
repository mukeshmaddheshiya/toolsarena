import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RemoveDuplicateLinesTool } from './RemoveDuplicateLinesTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('remove-duplicate-lines')!);
}
export default function RemoveDuplicateLinesPage() {
  return <ToolPageWrapper slug="remove-duplicate-lines"><RemoveDuplicateLinesTool /></ToolPageWrapper>;
}
