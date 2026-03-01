import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BoxShadowGeneratorTool } from './BoxShadowGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('box-shadow-generator')!); }
export default function Page() { return <ToolPageWrapper slug="box-shadow-generator"><BoxShadowGeneratorTool /></ToolPageWrapper>; }
