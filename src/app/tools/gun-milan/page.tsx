import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GunMilanTool } from './GunMilanTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('gun-milan')!);
}

export default function GunMilanPage() {
  return (
    <ToolPageWrapper slug="gun-milan">
      <GunMilanTool />
    </ToolPageWrapper>
  );
}
