import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ExcelToPdfTool } from './ExcelToPdfTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('excel-to-pdf')!);
}
export default function ExcelToPdfPage() {
  return <ToolPageWrapper slug="excel-to-pdf"><ExcelToPdfTool /></ToolPageWrapper>;
}
