import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TemperatureConverterTool } from './TemperatureConverterTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('temperature-converter')!); }
export default function TemperatureConverterPage() { return <ToolPageWrapper slug="temperature-converter"><TemperatureConverterTool /></ToolPageWrapper>; }
