import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CompressImageToKbTool } from './CompressImageToKbTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('compress-image-to-kb')!); }
export default function CompressImageToKbPage() { return <ToolPageWrapper slug="compress-image-to-kb"><CompressImageToKbTool /></ToolPageWrapper>; }
