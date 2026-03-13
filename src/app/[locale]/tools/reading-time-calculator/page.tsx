import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ReadingTimeCalculatorTool } from './ReadingTimeCalculatorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('reading-time-calculator')!); }
export default function ReadingTimeCalculatorPage() { return <ToolPageWrapper slug="reading-time-calculator"><ReadingTimeCalculatorTool /></ToolPageWrapper>; }
