import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PDFCompressTool } from './PDFCompressTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-compress')!); }
export default function PDFCompressPage() { return <ToolPageWrapper slug="pdf-compress"><PDFCompressTool /></ToolPageWrapper>; }
