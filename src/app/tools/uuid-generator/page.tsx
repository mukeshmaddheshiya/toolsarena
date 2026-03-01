import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { UuidGeneratorTool } from './UuidGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('uuid-generator')!); }
export default function Page() { return <ToolPageWrapper slug="uuid-generator"><UuidGeneratorTool /></ToolPageWrapper>; }
