import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { JpgToPdfTool } from './JpgToPdfTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('jpg-to-pdf')!); }
export default function JpgToPdfPage() { return <ToolPageWrapper slug="jpg-to-pdf"><JpgToPdfTool /></ToolPageWrapper>; }
