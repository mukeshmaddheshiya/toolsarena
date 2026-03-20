import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { UpiQrGeneratorTool } from './UpiQrGeneratorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('upi-qr-generator')!);
}

export default function UpiQrGeneratorPage() {
  return (
    <ToolPageWrapper slug="upi-qr-generator">
      <UpiQrGeneratorTool />
    </ToolPageWrapper>
  );
}
