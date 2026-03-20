import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BusinessNameGeneratorTool } from './BusinessNameGeneratorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('business-name-generator')!);
}

export default function BusinessNameGeneratorPage() {
  return (
    <ToolPageWrapper slug="business-name-generator">
      <BusinessNameGeneratorTool />
    </ToolPageWrapper>
  );
}
