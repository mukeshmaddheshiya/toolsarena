import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AtsResumeScoreFixerTool } from './AtsResumeScoreFixerTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('ats-resume-score-fixer')!);
}

export default function AtsResumeScoreFixerPage() {
  return (
    <ToolPageWrapper slug="ats-resume-score-fixer">
      <AtsResumeScoreFixerTool />
    </ToolPageWrapper>
  );
}
