import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NumberToWordsTool } from './NumberToWordsTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('number-to-words')!); }
export default function NumberToWordsPage() { return <ToolPageWrapper slug="number-to-words"><NumberToWordsTool /></ToolPageWrapper>; }
