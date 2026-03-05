import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AverageCalculatorTool } from './AverageCalculatorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('average-calculator')!); }
export default function AverageCalculatorPage() { return <ToolPageWrapper slug="average-calculator"><AverageCalculatorTool /></ToolPageWrapper>; }
