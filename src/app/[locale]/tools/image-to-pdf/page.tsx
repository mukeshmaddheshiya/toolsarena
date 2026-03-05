import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageToPdfTool } from './ImageToPdfTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('image-to-pdf')!);
}

export default function ImageToPdfPage() {
  return (
    <ToolPageWrapper slug="image-to-pdf">
      <ImageToPdfTool />
    </ToolPageWrapper>
  );
}
