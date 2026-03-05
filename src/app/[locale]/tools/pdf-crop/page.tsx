import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PdfCropTool } from './PdfCropTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-crop')!); }
export default function PdfCropPage() { return <ToolPageWrapper slug="pdf-crop"><PdfCropTool /></ToolPageWrapper>; }
