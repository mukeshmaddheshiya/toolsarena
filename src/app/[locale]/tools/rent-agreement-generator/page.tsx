import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RentAgreementGeneratorTool } from './RentAgreementGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('rent-agreement-generator')!);
}

export default function RentAgreementGeneratorPage() {
  return (
    <ToolPageWrapper slug="rent-agreement-generator">
      <RentAgreementGeneratorTool />
    </ToolPageWrapper>
  );
}
