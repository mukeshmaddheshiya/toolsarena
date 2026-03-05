import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PassportPhotoMakerTool } from './PassportPhotoMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('passport-photo-maker')!);
}

export default function PassportPhotoMakerPage() {
  return (
    <ToolPageWrapper slug="passport-photo-maker">
      <PassportPhotoMakerTool />
    </ToolPageWrapper>
  );
}
