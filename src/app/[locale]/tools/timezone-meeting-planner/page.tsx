import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TimezoneMeetingPlannerTool } from './TimezoneMeetingPlannerTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('timezone-meeting-planner')!);
}

export default function TimezoneMeetingPlannerPage() {
  return (
    <ToolPageWrapper slug="timezone-meeting-planner">
      <TimezoneMeetingPlannerTool />
    </ToolPageWrapper>
  );
}
