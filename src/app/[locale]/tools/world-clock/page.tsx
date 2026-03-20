import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WorldClockTool } from './WorldClockTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('world-clock')!);
}

export default function WorldClockPage() {
  return (
    <ToolPageWrapper slug="world-clock">
      <WorldClockTool />
    </ToolPageWrapper>
  );
}
