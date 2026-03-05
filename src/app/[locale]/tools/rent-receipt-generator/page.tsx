import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RentReceiptGeneratorTool } from './RentReceiptGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('rent-receipt-generator')!);
}

export default function RentReceiptGeneratorPage() {
  return (
    <ToolPageWrapper slug="rent-receipt-generator">
      <RentReceiptGeneratorTool />
    </ToolPageWrapper>
  );
}
