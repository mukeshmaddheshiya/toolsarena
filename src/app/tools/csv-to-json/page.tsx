import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CsvToJsonTool } from './CsvToJsonTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('csv-to-json')!); }
export default function CsvToJsonPage() { return <ToolPageWrapper slug="csv-to-json"><CsvToJsonTool /></ToolPageWrapper>; }
