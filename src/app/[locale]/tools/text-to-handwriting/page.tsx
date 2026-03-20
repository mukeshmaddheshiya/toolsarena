import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TextToHandwritingTool } from './TextToHandwritingTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('text-to-handwriting')!);
}

export default function TextToHandwritingPage() {
  return (
    <ToolPageWrapper slug="text-to-handwriting">
      <TextToHandwritingTool />
    </ToolPageWrapper>
  );
}
