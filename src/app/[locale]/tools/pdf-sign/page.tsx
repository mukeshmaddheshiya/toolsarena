import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PdfSignTool } from './PdfSignTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-sign')!); }
export default function PdfSignPage() { return <ToolPageWrapper slug="pdf-sign"><PdfSignTool /></ToolPageWrapper>; }
