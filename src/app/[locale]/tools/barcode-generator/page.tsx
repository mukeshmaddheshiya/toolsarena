import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BarcodeGeneratorTool } from './BarcodeGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('barcode-generator')!);
}

export default function BarcodeGeneratorPage() {
  return (
    <ToolPageWrapper slug="barcode-generator">
      <BarcodeGeneratorTool />
    </ToolPageWrapper>
  );
}
