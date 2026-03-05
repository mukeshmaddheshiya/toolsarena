import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { IpAddressLookupTool } from './IpAddressLookupTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ip-address-lookup')!);
}

export default function IpAddressLookupPage() {
  return (
    <ToolPageWrapper slug="ip-address-lookup">
      <IpAddressLookupTool />
    </ToolPageWrapper>
  );
}
