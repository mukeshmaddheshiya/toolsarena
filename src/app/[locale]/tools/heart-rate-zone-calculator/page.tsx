import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HeartRateZoneCalculatorTool } from './HeartRateZoneCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('heart-rate-zone-calculator')!);
}

export default function HeartRateZoneCalculatorPage() {
  return (
    <ToolPageWrapper slug="heart-rate-zone-calculator">
      <HeartRateZoneCalculatorTool />
    </ToolPageWrapper>
  );
}
