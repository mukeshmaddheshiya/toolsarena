import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TipCalculatorTool } from './TipCalculatorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('tip-calculator')!); }
export default function Page() { return <ToolPageWrapper slug="tip-calculator"><TipCalculatorTool /></ToolPageWrapper>; }
