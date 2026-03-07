import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepseCalculator } from './NepseCalculator';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('nepse-calculator')!); }
export default function NepseCalculatorPage() { return <ToolPageWrapper slug="nepse-calculator"><NepseCalculator /></ToolPageWrapper>; }
