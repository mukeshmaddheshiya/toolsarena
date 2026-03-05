import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CronGeneratorTool } from './CronGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('cron-generator')!);
}

export default function CronGeneratorPage() {
  return (
    <ToolPageWrapper slug="cron-generator">
      <CronGeneratorTool />
    </ToolPageWrapper>
  );
}
