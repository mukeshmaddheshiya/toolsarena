import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AadhaarValidatorTool } from './AadhaarValidatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('aadhaar-validator')!);
}

export default function AadhaarValidatorPage() {
  return (
    <ToolPageWrapper slug="aadhaar-validator">
      <AadhaarValidatorTool />
    </ToolPageWrapper>
  );
}
