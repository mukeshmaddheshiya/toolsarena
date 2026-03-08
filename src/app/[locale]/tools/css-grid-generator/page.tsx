import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CssGridGeneratorTool } from './CssGridGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('css-grid-generator')!); }
export default function Page() { return <ToolPageWrapper slug="css-grid-generator"><CssGridGeneratorTool /></ToolPageWrapper>; }
