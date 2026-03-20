import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GstBreakdownCalculatorTool } from './GstBreakdownCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('gst-breakdown-calculator')!);
}

export default function GstBreakdownCalculatorPage() {
  return (
    <ToolPageWrapper slug="gst-breakdown-calculator">
      <GstBreakdownCalculatorTool />
    </ToolPageWrapper>
  );
}
