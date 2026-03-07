import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WhatsAppChatGeneratorTool } from './WhatsAppChatGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('whatsapp-chat-generator')!);
}

export default function WhatsAppChatGeneratorPage() {
  return (
    <ToolPageWrapper slug="whatsapp-chat-generator">
      <WhatsAppChatGeneratorTool />
    </ToolPageWrapper>
  );
}
