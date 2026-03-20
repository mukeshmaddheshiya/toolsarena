import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepaliNameMeaningTool } from './NepaliNameMeaningTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('nepali-name-meaning')!);
}

export default function NepaliNameMeaningPage() {
  return (
    <ToolPageWrapper slug="nepali-name-meaning">
      <NepaliNameMeaningTool />
    </ToolPageWrapper>
  );
}
