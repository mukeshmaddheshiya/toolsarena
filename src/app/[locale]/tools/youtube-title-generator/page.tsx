import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { YoutubeTitleGeneratorTool } from './YoutubeTitleGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('youtube-title-generator')!); }
export default function Page() { return <ToolPageWrapper slug="youtube-title-generator"><YoutubeTitleGeneratorTool /></ToolPageWrapper>; }
