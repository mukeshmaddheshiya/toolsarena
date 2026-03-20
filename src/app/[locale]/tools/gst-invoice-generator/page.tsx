import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GstInvoiceGeneratorTool } from './GstInvoiceGeneratorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('gst-invoice-generator')!);
}

export default function GstInvoiceGeneratorPage() {
  return (
    <ToolPageWrapper slug="gst-invoice-generator">
      <GstInvoiceGeneratorTool />
    </ToolPageWrapper>
  );
}
