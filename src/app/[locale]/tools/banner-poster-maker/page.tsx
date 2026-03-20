import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BannerPosterMakerTool } from './BannerPosterMakerTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('banner-poster-maker')!);
}

export default function BannerPosterMakerPage() {
  return (
    <ToolPageWrapper slug="banner-poster-maker">
      <BannerPosterMakerTool />
    </ToolPageWrapper>
  );
}
