import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TextDiffTool } from './TextDiffTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('text-diff')!); }
export default function Page() { return <ToolPageWrapper slug="text-diff"><TextDiffTool /></ToolPageWrapper>; }
