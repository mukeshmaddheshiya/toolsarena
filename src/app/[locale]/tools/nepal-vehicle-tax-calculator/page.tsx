import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalVehicleTaxCalculatorTool } from './NepalVehicleTaxCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nepal-vehicle-tax-calculator')!);
}
export default function NepalVehicleTaxCalculatorPage() {
  return <ToolPageWrapper slug="nepal-vehicle-tax-calculator"><NepalVehicleTaxCalculatorTool /></ToolPageWrapper>;
}
