import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HashGeneratorTool } from './HashGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('hash-generator')!);
}

export default function HashGeneratorPage() {
  return (
    <ToolPageWrapper slug="hash-generator">
      <HashGeneratorTool />
    </ToolPageWrapper>
  );
}
