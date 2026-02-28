import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageResizerTool } from './ImageResizerTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('image-resizer')!); }
export default function ImageResizerPage() { return <ToolPageWrapper slug="image-resizer"><ImageResizerTool /></ToolPageWrapper>; }
