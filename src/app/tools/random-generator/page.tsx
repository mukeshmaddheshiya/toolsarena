import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RandomGeneratorTool } from './RandomGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('random-generator')!); }
export default function Page() { return <ToolPageWrapper slug="random-generator"><RandomGeneratorTool /></ToolPageWrapper>; }
