import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ReadabilityScoreCheckerTool } from './ReadabilityScoreCheckerTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('readability-score-checker')!);
}

export default function ReadabilityScoreCheckerPage() {
  return (
    <ToolPageWrapper slug="readability-score-checker">
      <ReadabilityScoreCheckerTool />
    </ToolPageWrapper>
  );
}
