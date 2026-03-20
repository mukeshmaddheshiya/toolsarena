import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PincodeLookupTool } from './PincodeLookupTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('pincode-lookup')!);
}

export default function PincodeLookupPage() {
  return (
    <ToolPageWrapper slug="pincode-lookup">
      <PincodeLookupTool />
    </ToolPageWrapper>
  );
}
