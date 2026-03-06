import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CssFlexboxGeneratorTool } from './CssFlexboxGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('css-flexbox-generator')!); }
export default function CssFlexboxGeneratorPage() { return <ToolPageWrapper slug="css-flexbox-generator"><CssFlexboxGeneratorTool /></ToolPageWrapper>; }
