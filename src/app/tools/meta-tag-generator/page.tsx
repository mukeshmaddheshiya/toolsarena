import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MetaTagGeneratorTool } from './MetaTagGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('meta-tag-generator')!); }
export default function Page() { return <ToolPageWrapper slug="meta-tag-generator"><MetaTagGeneratorTool /></ToolPageWrapper>; }
