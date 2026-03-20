import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalLandPriceEstimatorTool } from './NepalLandPriceEstimatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('nepal-land-price-estimator')!);
}

export default function NepalLandPriceEstimatorPage() {
  return (
    <ToolPageWrapper slug="nepal-land-price-estimator">
      <NepalLandPriceEstimatorTool />
    </ToolPageWrapper>
  );
}
