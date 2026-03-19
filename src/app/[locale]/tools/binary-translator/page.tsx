import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BinaryTranslatorTool } from './BinaryTranslatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('binary-translator')!);
}
export default function BinaryTranslatorPage() {
  return <ToolPageWrapper slug="binary-translator"><BinaryTranslatorTool /></ToolPageWrapper>;
}
