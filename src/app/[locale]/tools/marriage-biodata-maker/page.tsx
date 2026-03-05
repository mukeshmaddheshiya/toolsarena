import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MarriageBiodataMakerTool } from './MarriageBiodataMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('marriage-biodata-maker')!);
}

export default function MarriageBiodataMakerPage() {
  return (
    <ToolPageWrapper slug="marriage-biodata-maker">
      <MarriageBiodataMakerTool />
    </ToolPageWrapper>
  );
}
