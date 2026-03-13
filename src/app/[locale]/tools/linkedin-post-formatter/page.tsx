import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LinkedinPostFormatterTool } from './LinkedinPostFormatterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('linkedin-post-formatter')!);
}

export default function LinkedinPostFormatterPage() {
  return (
    <ToolPageWrapper slug="linkedin-post-formatter">
      <LinkedinPostFormatterTool />
    </ToolPageWrapper>
  );
}
