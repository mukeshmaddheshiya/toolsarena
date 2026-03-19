import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CoinFlipTool } from './CoinFlipTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('coin-flip')!);
}
export default function CoinFlipPage() {
  return <ToolPageWrapper slug="coin-flip"><CoinFlipTool /></ToolPageWrapper>;
}
