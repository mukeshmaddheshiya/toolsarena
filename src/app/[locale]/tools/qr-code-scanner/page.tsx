import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { QrCodeScannerTool } from './QrCodeScannerTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('qr-code-scanner')!);
}

export default function QrCodeScannerPage() {
  return (
    <ToolPageWrapper slug="qr-code-scanner">
      <QrCodeScannerTool />
    </ToolPageWrapper>
  );
}
