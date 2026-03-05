import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PdfPageNumbersTool } from './PdfPageNumbersTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-page-numbers')!); }
export default function PdfPageNumbersPage() { return <ToolPageWrapper slug="pdf-page-numbers"><PdfPageNumbersTool /></ToolPageWrapper>; }
