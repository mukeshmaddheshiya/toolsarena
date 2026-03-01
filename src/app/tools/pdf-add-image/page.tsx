import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PdfAddImageTool } from './PdfAddImageTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-add-image')!); }
export default function PdfAddImagePage() { return <ToolPageWrapper slug="pdf-add-image"><PdfAddImageTool /></ToolPageWrapper>; }
