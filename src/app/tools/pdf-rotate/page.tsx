import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PdfRotateTool } from './PdfRotateTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-rotate')!); }
export default function PdfRotatePage() { return <ToolPageWrapper slug="pdf-rotate"><PdfRotateTool /></ToolPageWrapper>; }
