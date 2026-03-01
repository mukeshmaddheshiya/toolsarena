import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PdfWatermarkTool } from './PdfWatermarkTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-watermark')!); }
export default function PdfWatermarkPage() { return <ToolPageWrapper slug="pdf-watermark"><PdfWatermarkTool /></ToolPageWrapper>; }
