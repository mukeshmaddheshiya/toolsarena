import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ExifViewerTool } from './ExifViewerTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('exif-viewer')!);
}

export default function ExifViewerPage() {
  return (
    <ToolPageWrapper slug="exif-viewer">
      <ExifViewerTool />
    </ToolPageWrapper>
  );
}
