import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PDFToImageTool } from './PDFToImageTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-to-image')!); }
export default function PDFToImagePage() { return <ToolPageWrapper slug="pdf-to-image"><PDFToImageTool /></ToolPageWrapper>; }
