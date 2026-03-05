import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { IplTeamSquadExplorerTool } from './IplTeamSquadExplorerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ipl-team-squad-explorer')!);
}
export default function IplTeamSquadExplorerPage() {
  return (
    <ToolPageWrapper slug="ipl-team-squad-explorer">
      <IplTeamSquadExplorerTool />
    </ToolPageWrapper>
  );
}
