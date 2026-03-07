import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BusinessCardMakerTool } from './BusinessCardMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('business-card-maker')!);
}

export default function BusinessCardMakerPage() {
  return (
    <ToolPageWrapper slug="business-card-maker">
      <BusinessCardMakerTool />
    </ToolPageWrapper>
  );
}
