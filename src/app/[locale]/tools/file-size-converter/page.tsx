import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { FileSizeConverterTool } from './FileSizeConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('file-size-converter')!);
}

export default function FileSizeConverterPage() {
  return (
    <ToolPageWrapper slug="file-size-converter">
      <FileSizeConverterTool />
    </ToolPageWrapper>
  );
}
