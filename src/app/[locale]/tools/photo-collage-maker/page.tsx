import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PhotoCollageMakerTool } from './PhotoCollageMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('photo-collage-maker')!);
}

export default function PhotoCollageMakerPage() {
  return (
    <ToolPageWrapper slug="photo-collage-maker">
      <PhotoCollageMakerTool />
    </ToolPageWrapper>
  );
}
