import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LetterWriterTool } from './LetterWriterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('letter-application-writer')!);
}

export default function LetterWriterPage() {
  return (
    <ToolPageWrapper slug="letter-application-writer">
      <LetterWriterTool />
    </ToolPageWrapper>
  );
}
