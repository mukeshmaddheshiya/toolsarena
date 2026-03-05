import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ColorPaletteFromImageTool } from './ColorPaletteFromImageTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('color-palette-from-image')!);
}

export default function ColorPaletteFromImagePage() {
  return (
    <ToolPageWrapper slug="color-palette-from-image">
      <ColorPaletteFromImageTool />
    </ToolPageWrapper>
  );
}
