import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NetWorthCalculatorTool } from './NetWorthCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('net-worth-calculator')!);
}

export default function NetWorthCalculatorPage() {
  return (
    <ToolPageWrapper slug="net-worth-calculator">
      <NetWorthCalculatorTool />
    </ToolPageWrapper>
  );
}
