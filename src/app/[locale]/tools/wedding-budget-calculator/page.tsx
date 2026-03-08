import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WeddingBudgetCalculatorTool } from './WeddingBudgetCalculatorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('wedding-budget-calculator')!); }
export default function Page() { return <ToolPageWrapper slug="wedding-budget-calculator"><WeddingBudgetCalculatorTool /></ToolPageWrapper>; }
