import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepaliTypingTool } from './NepaliTypingTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('nepali-typing')!); }
export default function NepaliTypingPage() { return <ToolPageWrapper slug="nepali-typing"><NepaliTypingTool /></ToolPageWrapper>; }
