import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SocialMediaPostMockupTool } from './SocialMediaPostMockupTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('social-media-post-mockup')!);
}

export default function SocialMediaPostMockupPage() {
  return (
    <ToolPageWrapper slug="social-media-post-mockup">
      <SocialMediaPostMockupTool />
    </ToolPageWrapper>
  );
}
