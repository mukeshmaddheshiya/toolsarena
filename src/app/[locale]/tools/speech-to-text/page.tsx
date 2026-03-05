import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SpeechToTextTool } from './SpeechToTextTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('speech-to-text')!);
}

export default function SpeechToTextPage() {
  return (
    <ToolPageWrapper slug="speech-to-text">
      <SpeechToTextTool />
    </ToolPageWrapper>
  );
}
