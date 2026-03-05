import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { OnlineSignatureMakerTool } from './OnlineSignatureMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('online-signature-maker')!);
}

export default function OnlineSignatureMakerPage() {
  return (
    <ToolPageWrapper slug="online-signature-maker">
      <OnlineSignatureMakerTool />
    </ToolPageWrapper>
  );
}
