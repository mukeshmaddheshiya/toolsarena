import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { OfferLetterGeneratorTool } from './OfferLetterGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('offer-letter-generator')!);
}

export default function Page() {
  return <ToolPageWrapper slug="offer-letter-generator"><OfferLetterGeneratorTool /></ToolPageWrapper>;
}
