import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CsvViewerTool } from './CsvViewerTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('csv-viewer')!); }
export default function CsvViewerPage() { return <ToolPageWrapper slug="csv-viewer"><CsvViewerTool /></ToolPageWrapper>; }
