import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { JPGToPNGTool } from './JPGToPNGTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('jpg-to-png')!); }
export default function JPGToPNGPage() { return <ToolPageWrapper slug="jpg-to-png"><JPGToPNGTool /></ToolPageWrapper>; }
