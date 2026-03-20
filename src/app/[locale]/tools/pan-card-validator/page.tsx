import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PanCardValidatorTool } from './PanCardValidatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('pan-card-validator')!);
}

export default function PanCardValidatorPage() {
  return (
    <ToolPageWrapper slug="pan-card-validator">
      <PanCardValidatorTool />
    </ToolPageWrapper>
  );
}
