import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { YoutubeChannelStatsTool } from './YoutubeChannelStatsTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('youtube-channel-stats')!);
}

export default function YoutubeChannelStatsPage() {
  return (
    <ToolPageWrapper slug="youtube-channel-stats">
      <YoutubeChannelStatsTool />
    </ToolPageWrapper>
  );
}
