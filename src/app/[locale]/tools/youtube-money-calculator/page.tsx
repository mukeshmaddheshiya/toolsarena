import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { YouTubeMoneyCalculator } from './YouTubeMoneyCalculator';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('youtube-money-calculator')!); }
export default function YouTubeMoneyCalculatorPage() { return <ToolPageWrapper slug="youtube-money-calculator"><YouTubeMoneyCalculator /></ToolPageWrapper>; }
