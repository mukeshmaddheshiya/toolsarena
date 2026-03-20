import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WhatsAppChatAnalyzerTool } from './WhatsAppChatAnalyzerTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('whatsapp-chat-analyzer')!);
}

export default function WhatsAppChatAnalyzerPage() {
  return (
    <ToolPageWrapper slug="whatsapp-chat-analyzer">
      <WhatsAppChatAnalyzerTool />
    </ToolPageWrapper>
  );
}
