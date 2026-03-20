import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GstinValidatorTool } from './GstinValidatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('gstin-validator')!);
}

export default function GstinValidatorPage() {
  return (
    <ToolPageWrapper slug="gstin-validator">
      <GstinValidatorTool />
    </ToolPageWrapper>
  );
}
