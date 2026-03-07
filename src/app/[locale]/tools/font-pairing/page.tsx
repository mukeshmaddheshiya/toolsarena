import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { FontPairingTool } from './FontPairingTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('font-pairing')!);
}

export default function FontPairingPage() {
  return (
    <ToolPageWrapper slug="font-pairing">
      <FontPairingTool />
    </ToolPageWrapper>
  );
}
