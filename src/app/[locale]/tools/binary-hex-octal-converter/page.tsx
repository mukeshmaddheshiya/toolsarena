import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BinaryHexOctalConverterTool } from './BinaryHexOctalConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('binary-hex-octal-converter')!);
}

export default function BinaryHexOctalConverterPage() {
  return (
    <ToolPageWrapper slug="binary-hex-octal-converter">
      <BinaryHexOctalConverterTool />
    </ToolPageWrapper>
  );
}
