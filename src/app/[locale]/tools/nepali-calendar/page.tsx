import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepaliCalendarTool } from './NepaliCalendarTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('nepali-calendar')!);
}

export default function NepaliCalendarPage() {
  return (
    <ToolPageWrapper slug="nepali-calendar">
      <NepaliCalendarTool />
    </ToolPageWrapper>
  );
}
