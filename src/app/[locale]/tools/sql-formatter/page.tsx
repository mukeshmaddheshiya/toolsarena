import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SqlFormatterTool } from './SqlFormatterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('sql-formatter')!);
}

export default function SqlFormatterPage() {
  return (
    <ToolPageWrapper slug="sql-formatter">
      <SqlFormatterTool />
    </ToolPageWrapper>
  );
}
