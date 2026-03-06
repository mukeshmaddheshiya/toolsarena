import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { InstagramEngagementCalculator } from './InstagramEngagementCalculator';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('instagram-engagement-calculator')!); }
export default function InstagramEngagementCalculatorPage() { return <ToolPageWrapper slug="instagram-engagement-calculator"><InstagramEngagementCalculator /></ToolPageWrapper>; }
