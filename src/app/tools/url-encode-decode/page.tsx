import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { URLEncoderTool } from './URLEncoderTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('url-encode-decode')!);
}

export default function URLEncoderPage() {
  return (
    <ToolPageWrapper slug="url-encode-decode">
      <URLEncoderTool />
    </ToolPageWrapper>
  );
}
