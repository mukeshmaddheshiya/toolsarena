import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TextRepeaterTool } from './TextRepeaterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('text-repeater')!);
}

export default function TextRepeaterPage() {
  return (
    <ToolPageWrapper slug="text-repeater">
      <TextRepeaterTool />
    </ToolPageWrapper>
  );
}
