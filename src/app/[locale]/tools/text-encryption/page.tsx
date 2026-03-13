import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TextEncryptionTool } from './TextEncryptionTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('text-encryption')!);
}

export default function TextEncryptionPage() {
  return (
    <ToolPageWrapper slug="text-encryption">
      <TextEncryptionTool />
    </ToolPageWrapper>
  );
}
