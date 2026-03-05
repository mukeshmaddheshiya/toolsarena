import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { OnlineNotepadTool } from './OnlineNotepadTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('online-notepad')!);
}

export default function OnlineNotepadPage() {
  return (
    <ToolPageWrapper slug="online-notepad">
      <OnlineNotepadTool />
    </ToolPageWrapper>
  );
}
