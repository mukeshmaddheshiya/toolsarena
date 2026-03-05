import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ColorPickerTool } from './ColorPickerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('color-picker')!);
}

export default function ColorPickerPage() {
  return (
    <ToolPageWrapper slug="color-picker">
      <ColorPickerTool />
    </ToolPageWrapper>
  );
}
