import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepaliDateConverterTool } from './NepaliDateConverterTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('nepali-date-converter')!); }
export default function NepaliDateConverterPage() { return <ToolPageWrapper slug="nepali-date-converter"><NepaliDateConverterTool /></ToolPageWrapper>; }
