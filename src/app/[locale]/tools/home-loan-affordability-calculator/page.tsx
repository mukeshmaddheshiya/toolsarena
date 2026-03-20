import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HomeLoanAffordabilityTool } from './HomeLoanAffordabilityTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('home-loan-affordability-calculator')!);
}

export default function HomeLoanAffordabilityPage() {
  return (
    <ToolPageWrapper slug="home-loan-affordability-calculator">
      <HomeLoanAffordabilityTool />
    </ToolPageWrapper>
  );
}
