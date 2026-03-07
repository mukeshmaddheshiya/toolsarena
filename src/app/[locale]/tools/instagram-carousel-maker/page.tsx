import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { InstagramCarouselMakerTool } from './InstagramCarouselMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('instagram-carousel-maker')!);
}

export default function InstagramCarouselMakerPage() {
  return (
    <ToolPageWrapper slug="instagram-carousel-maker">
      <InstagramCarouselMakerTool />
    </ToolPageWrapper>
  );
}
