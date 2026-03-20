import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CssTextEffectsGeneratorTool } from './CssTextEffectsGeneratorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('css-text-effects-generator')!);
}

export default function CssTextEffectsGeneratorPage() {
  return (
    <ToolPageWrapper slug="css-text-effects-generator">
      <CssTextEffectsGeneratorTool />
    </ToolPageWrapper>
  );
}
