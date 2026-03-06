import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BlurFaceInPhotoTool } from './BlurFaceInPhotoTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('blur-face-in-photo')!);
}

export default function BlurFaceInPhotoPage() {
  return (
    <ToolPageWrapper slug="blur-face-in-photo">
      <BlurFaceInPhotoTool />
    </ToolPageWrapper>
  );
}
