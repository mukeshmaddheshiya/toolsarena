import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TermsAndConditionsGeneratorTool } from './TermsAndConditionsGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('terms-and-conditions-generator')!); }
export default function TermsAndConditionsGeneratorPage() { return <ToolPageWrapper slug="terms-and-conditions-generator"><TermsAndConditionsGeneratorTool /></ToolPageWrapper>; }
