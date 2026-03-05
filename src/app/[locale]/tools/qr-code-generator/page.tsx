import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { QRCodeTool } from './QRCodeTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('qr-code-generator')!);
}

export default function QRCodePage() {
  return (
    <ToolPageWrapper slug="qr-code-generator">
      <QRCodeTool />
    </ToolPageWrapper>
  );
}
