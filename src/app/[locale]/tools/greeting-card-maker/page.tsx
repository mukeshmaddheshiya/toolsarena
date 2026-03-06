import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GreetingCardMakerTool } from './GreetingCardMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('greeting-card-maker')!);
}

export default function GreetingCardMakerPage() {
  return (
    <ToolPageWrapper slug="greeting-card-maker">
      <GreetingCardMakerTool />
    </ToolPageWrapper>
  );
}
