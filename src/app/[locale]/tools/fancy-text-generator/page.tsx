import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { FancyTextGeneratorTool } from './FancyTextGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('fancy-text-generator')!); }
export default function Page() { return <ToolPageWrapper slug="fancy-text-generator"><FancyTextGeneratorTool /></ToolPageWrapper>; }
