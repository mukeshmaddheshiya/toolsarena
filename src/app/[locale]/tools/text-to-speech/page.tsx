import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TextToSpeechTool } from './TextToSpeechTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('text-to-speech')!);
}

export default function TextToSpeechPage() {
  return (
    <ToolPageWrapper slug="text-to-speech">
      <TextToSpeechTool />
    </ToolPageWrapper>
  );
}
