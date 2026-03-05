import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { InvoiceGeneratorTool } from './InvoiceGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('invoice-generator')!);
}
export default function InvoiceGeneratorPage() {
  return <ToolPageWrapper slug="invoice-generator"><InvoiceGeneratorTool /></ToolPageWrapper>;
}
