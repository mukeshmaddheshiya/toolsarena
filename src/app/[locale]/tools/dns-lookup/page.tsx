import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { DnsLookupTool } from './DnsLookupTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('dns-lookup')!);
}

export default function DnsLookupPage() {
  return (
    <ToolPageWrapper slug="dns-lookup">
      <DnsLookupTool />
    </ToolPageWrapper>
  );
}
