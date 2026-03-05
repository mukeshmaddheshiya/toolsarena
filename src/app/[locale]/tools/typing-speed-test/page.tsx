import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TypingSpeedTestTool } from './TypingSpeedTestTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('typing-speed-test')!);
}

export default function TypingSpeedTestPage() {
  return (
    <ToolPageWrapper slug="typing-speed-test">
      <TypingSpeedTestTool />
    </ToolPageWrapper>
  );
}
