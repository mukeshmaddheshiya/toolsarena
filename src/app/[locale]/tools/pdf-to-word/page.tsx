import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PDFToWordTool } from './PDFToWordTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-to-word')!); }
export default function PDFToWordPage() { return <ToolPageWrapper slug="pdf-to-word"><PDFToWordTool /></ToolPageWrapper>; }
