import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ThumbnailMakerTool } from './ThumbnailMakerTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('thumbnail-maker')!);
}

export default function ThumbnailMakerPage() {
  return (
    <ToolPageWrapper slug="thumbnail-maker">
      <ThumbnailMakerTool />
    </ToolPageWrapper>
  );
}
