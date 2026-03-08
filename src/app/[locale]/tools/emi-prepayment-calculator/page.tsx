import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { EmiPrepaymentCalculatorTool } from './EmiPrepaymentCalculatorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('emi-prepayment-calculator')!); }
export default function Page() { return <ToolPageWrapper slug="emi-prepayment-calculator"><EmiPrepaymentCalculatorTool /></ToolPageWrapper>; }
