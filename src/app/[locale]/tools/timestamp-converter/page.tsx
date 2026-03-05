import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TimestampConverterTool } from './TimestampConverterTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('timestamp-converter')!); }
export default function TimestampConverterPage() { return <ToolPageWrapper slug="timestamp-converter"><TimestampConverterTool /></ToolPageWrapper>; }
