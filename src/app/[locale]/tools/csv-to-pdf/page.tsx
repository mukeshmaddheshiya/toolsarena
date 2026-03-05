import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CsvToPdfTool } from './CsvToPdfTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('csv-to-pdf')!); }
export default function CsvToPdfPage() { return <ToolPageWrapper slug="csv-to-pdf"><CsvToPdfTool /></ToolPageWrapper>; }
