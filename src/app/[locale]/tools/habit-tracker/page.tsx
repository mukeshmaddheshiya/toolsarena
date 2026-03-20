import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HabitTrackerTool } from './HabitTrackerTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('habit-tracker')!);
}

export default function HabitTrackerPage() {
  return (
    <ToolPageWrapper slug="habit-tracker">
      <HabitTrackerTool />
    </ToolPageWrapper>
  );
}
