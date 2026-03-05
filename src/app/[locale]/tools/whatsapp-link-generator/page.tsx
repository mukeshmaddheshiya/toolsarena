import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WhatsAppLinkGeneratorTool } from './WhatsAppLinkGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('whatsapp-link-generator')!);
}

export default function WhatsAppLinkGeneratorPage() {
  return (
    <ToolPageWrapper slug="whatsapp-link-generator">
      <WhatsAppLinkGeneratorTool />
    </ToolPageWrapper>
  );
}
