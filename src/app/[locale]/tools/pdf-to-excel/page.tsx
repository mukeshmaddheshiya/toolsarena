import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PdfToExcelTool } from './PdfToExcelTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-to-excel')!); }
export default function PdfToExcelPage() { return <ToolPageWrapper slug="pdf-to-excel"><PdfToExcelTool /></ToolPageWrapper>; }
