import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PreetiToUnicodeTool } from './PreetiToUnicodeTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('preeti-to-unicode')!); }
export default function PreetiToUnicodePage() { return <ToolPageWrapper slug="preeti-to-unicode"><PreetiToUnicodeTool /></ToolPageWrapper>; }
