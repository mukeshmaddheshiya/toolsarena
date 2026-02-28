import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { Base64Tool } from './Base64Tool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('base64-encode-decode')!);
}

export default function Base64Page() {
  return (
    <ToolPageWrapper slug="base64-encode-decode">
      <Base64Tool />
    </ToolPageWrapper>
  );
}
