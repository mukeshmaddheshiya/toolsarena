import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { IFSCCodeFinderTool } from './IFSCCodeFinderTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ifsc-code-finder')!);
}

export default function IFSCCodeFinderPage() {
  return (
    <ToolPageWrapper slug="ifsc-code-finder">
      <IFSCCodeFinderTool />
    </ToolPageWrapper>
  );
}
