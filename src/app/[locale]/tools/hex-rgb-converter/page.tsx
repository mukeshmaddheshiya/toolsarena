import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HexRgbConverterTool } from './HexRgbConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('hex-rgb-converter')!);
}

export default function HexRgbConverterPage() {
  return (
    <ToolPageWrapper slug="hex-rgb-converter">
      <HexRgbConverterTool />
    </ToolPageWrapper>
  );
}
