import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WebPToPNGTool } from './WebPToPNGTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('webp-to-png')!); }
export default function WebPToPNGPage() { return <ToolPageWrapper slug="webp-to-png"><WebPToPNGTool /></ToolPageWrapper>; }
