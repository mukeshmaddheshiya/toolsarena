import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { OnlineWhiteboardTool } from './OnlineWhiteboardTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('online-whiteboard')!);
}

export default function OnlineWhiteboardPage() {
  return (
    <ToolPageWrapper slug="online-whiteboard">
      <OnlineWhiteboardTool />
    </ToolPageWrapper>
  );
}
