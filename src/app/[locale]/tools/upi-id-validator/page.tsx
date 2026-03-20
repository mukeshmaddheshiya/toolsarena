import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { UpiIdValidatorTool } from './UpiIdValidatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('upi-id-validator')!);
}

export default function UpiIdValidatorPage() {
  return (
    <ToolPageWrapper slug="upi-id-validator">
      <UpiIdValidatorTool />
    </ToolPageWrapper>
  );
}
