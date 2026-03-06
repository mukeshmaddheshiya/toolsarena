import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CSSGradientTextGenerator } from './CSSGradientTextGenerator';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('css-gradient-text-generator')!); }
export default function CSSGradientTextGeneratorPage() { return <ToolPageWrapper slug="css-gradient-text-generator"><CSSGradientTextGenerator /></ToolPageWrapper>; }
