import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PDFMergeTool } from './PDFMergeTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-merge')!); }
export default function PDFMergePage() { return <ToolPageWrapper slug="pdf-merge"><PDFMergeTool /></ToolPageWrapper>; }
