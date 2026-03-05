import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { JsMinifierTool } from './JsMinifierTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('js-minifier')!);
}

export default function JsMinifierPage() {
  return (
    <ToolPageWrapper slug="js-minifier">
      <JsMinifierTool />
    </ToolPageWrapper>
  );
}
