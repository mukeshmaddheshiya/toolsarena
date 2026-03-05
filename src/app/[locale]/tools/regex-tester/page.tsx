import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RegexTesterTool } from './RegexTesterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('regex-tester')!);
}

export default function RegexTesterPage() {
  return (
    <ToolPageWrapper slug="regex-tester">
      <RegexTesterTool />
    </ToolPageWrapper>
  );
}
