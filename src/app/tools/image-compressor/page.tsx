import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageCompressorTool } from './ImageCompressorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('image-compressor')!); }
export default function ImageCompressorPage() { return <ToolPageWrapper slug="image-compressor"><ImageCompressorTool /></ToolPageWrapper>; }
