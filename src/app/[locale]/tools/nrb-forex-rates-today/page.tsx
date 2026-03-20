import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NrbForexRatesTodayTool } from './NrbForexRatesTodayTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('nrb-forex-rates-today')!);
}

export default function NrbForexRatesTodayPage() {
  return (
    <ToolPageWrapper slug="nrb-forex-rates-today">
      <NrbForexRatesTodayTool />
    </ToolPageWrapper>
  );
}
