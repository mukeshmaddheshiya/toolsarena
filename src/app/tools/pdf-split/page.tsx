import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PDFSplitTool } from './PDFSplitTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-split')!); }
export default function PDFSplitPage() { return <ToolPageWrapper slug="pdf-split"><PDFSplitTool /></ToolPageWrapper>; }
