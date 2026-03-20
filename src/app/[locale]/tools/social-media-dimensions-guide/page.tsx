import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SocialMediaDimensionsGuideTool } from './SocialMediaDimensionsGuideTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('social-media-dimensions-guide')!);
}

export default function SocialMediaDimensionsGuidePage() {
  return (
    <ToolPageWrapper slug="social-media-dimensions-guide">
      <SocialMediaDimensionsGuideTool />
    </ToolPageWrapper>
  );
}
