import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalBankInterestComparisonTool } from './NepalBankInterestComparisonTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('nepal-bank-interest-comparison')!);
}

export default function NepalBankInterestComparisonPage() {
  return (
    <ToolPageWrapper slug="nepal-bank-interest-comparison">
      <NepalBankInterestComparisonTool />
    </ToolPageWrapper>
  );
}
