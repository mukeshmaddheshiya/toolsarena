import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ZodiacCompatibilityTool } from './ZodiacCompatibilityTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('zodiac-compatibility')!);
}

export default function ZodiacCompatibilityPage() {
  return (
    <ToolPageWrapper slug="zodiac-compatibility">
      <ZodiacCompatibilityTool />
    </ToolPageWrapper>
  );
}
