import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WhatsappChatGeneratorTool } from './WhatsappChatGeneratorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('whatsapp-chat-generator')!);
}

export default function WhatsappChatGeneratorPage() {
  return (
    <ToolPageWrapper slug="whatsapp-chat-generator">
      <WhatsappChatGeneratorTool />
    </ToolPageWrapper>
  );
}
