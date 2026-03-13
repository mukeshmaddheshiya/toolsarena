import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WordToPdfTool } from './WordToPdfTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('word-to-pdf')!); }
export default function WordToPdfPage() { return <ToolPageWrapper slug="word-to-pdf"><WordToPdfTool /></ToolPageWrapper>; }
