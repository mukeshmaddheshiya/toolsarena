import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PrivacyPolicyGeneratorTool } from './PrivacyPolicyGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('privacy-policy-generator')!); }
export default function PrivacyPolicyGeneratorPage() { return <ToolPageWrapper slug="privacy-policy-generator"><PrivacyPolicyGeneratorTool /></ToolPageWrapper>; }
