import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageToBase64Tool } from './ImageToBase64Tool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('image-to-base64')!); }
export default function ImageToBase64Page() { return <ToolPageWrapper slug="image-to-base64"><ImageToBase64Tool /></ToolPageWrapper>; }
