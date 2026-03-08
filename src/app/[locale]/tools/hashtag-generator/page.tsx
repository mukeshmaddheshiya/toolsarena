import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HashtagGeneratorTool } from './HashtagGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('hashtag-generator')!); }
export default function Page() { return <ToolPageWrapper slug="hashtag-generator"><HashtagGeneratorTool /></ToolPageWrapper>; }
