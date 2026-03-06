import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CertificateMakerTool } from './CertificateMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('certificate-maker')!);
}
export default function CertificateMakerPage() {
  return <ToolPageWrapper slug="certificate-maker"><CertificateMakerTool /></ToolPageWrapper>;
}
