import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageFlipRotateTool } from './ImageFlipRotateTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('image-flip-rotate')!); }
export default function ImageFlipRotatePage() { return <ToolPageWrapper slug="image-flip-rotate"><ImageFlipRotateTool /></ToolPageWrapper>; }
