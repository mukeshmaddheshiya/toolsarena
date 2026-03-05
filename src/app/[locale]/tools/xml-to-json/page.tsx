import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { XmlToJsonTool } from './XmlToJsonTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('xml-to-json')!);
}

export default function XmlToJsonPage() {
  return (
    <ToolPageWrapper slug="xml-to-json">
      <XmlToJsonTool />
    </ToolPageWrapper>
  );
}
