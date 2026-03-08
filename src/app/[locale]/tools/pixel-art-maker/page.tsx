import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PixelArtMakerTool } from './PixelArtMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('pixel-art-maker')!);
}

export default function PixelArtMakerPage() {
  return (
    <ToolPageWrapper slug="pixel-art-maker">
      <PixelArtMakerTool />
    </ToolPageWrapper>
  );
}
