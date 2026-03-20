import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HomeLoanPrepaymentTool } from './HomeLoanPrepaymentTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('home-loan-prepayment-calculator')!);
}

export default function HomeLoanPrepaymentPage() {
  return (
    <ToolPageWrapper slug="home-loan-prepayment-calculator">
      <HomeLoanPrepaymentTool />
    </ToolPageWrapper>
  );
}
