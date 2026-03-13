import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PermutationCombinationTool } from './PermutationCombinationTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('permutation-combination')!);
}

export default function PermutationCombinationPage() {
  return (
    <ToolPageWrapper slug="permutation-combination">
      <PermutationCombinationTool />
    </ToolPageWrapper>
  );
}
