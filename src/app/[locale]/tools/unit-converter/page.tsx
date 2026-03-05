import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { UnitConverterTool } from './UnitConverterTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('unit-converter')!); }
export default function UnitConverterPage() { return <ToolPageWrapper slug="unit-converter"><UnitConverterTool /></ToolPageWrapper>; }
