import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TextBehindImageTool } from './TextBehindImageTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('text-behind-image')!); }
export default function Page() { return <ToolPageWrapper slug="text-behind-image"><TextBehindImageTool /></ToolPageWrapper>; }
