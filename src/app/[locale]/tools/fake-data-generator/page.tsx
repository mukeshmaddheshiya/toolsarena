import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { FakeDataGeneratorTool } from './FakeDataGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('fake-data-generator')!); }
export default function FakeDataGeneratorPage() { return <ToolPageWrapper slug="fake-data-generator"><FakeDataGeneratorTool /></ToolPageWrapper>; }
