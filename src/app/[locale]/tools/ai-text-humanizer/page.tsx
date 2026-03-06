import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AITextHumanizerTool } from './AITextHumanizerTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('ai-text-humanizer')!); }
export default function AITextHumanizerPage() { return <ToolPageWrapper slug="ai-text-humanizer"><AITextHumanizerTool /></ToolPageWrapper>; }
