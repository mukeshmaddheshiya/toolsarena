import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { EssayOutlineBuilderTool } from './EssayOutlineBuilderTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('essay-outline-builder')!); }
export default function Page() { return <ToolPageWrapper slug="essay-outline-builder"><EssayOutlineBuilderTool /></ToolPageWrapper>; }
