import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TotpGeneratorTool } from './TotpGeneratorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('totp-2fa-generator')!);
}

export default function TotpGeneratorPage() {
  return (
    <ToolPageWrapper slug="totp-2fa-generator">
      <TotpGeneratorTool />
    </ToolPageWrapper>
  );
}
