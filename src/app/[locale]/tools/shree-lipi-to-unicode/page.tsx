import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ShreeLipiToUnicodeTool } from './ShreeLipiToUnicodeTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('shree-lipi-to-unicode')!);
}

export default function ShreeLipiToUnicodePage() {
  return (
    <ToolPageWrapper slug="shree-lipi-to-unicode">
      <ShreeLipiToUnicodeTool />
    </ToolPageWrapper>
  );
}
