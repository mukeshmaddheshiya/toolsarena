import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PropertyRegistrationCalculatorTool } from './PropertyRegistrationCalculatorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('property-registration-calculator')!); }
export default function Page() { return <ToolPageWrapper slug="property-registration-calculator"><PropertyRegistrationCalculatorTool /></ToolPageWrapper>; }
