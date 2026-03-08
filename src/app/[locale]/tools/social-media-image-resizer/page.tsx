import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SocialMediaImageResizerTool } from './SocialMediaImageResizerTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('social-media-image-resizer')!); }
export default function Page() { return <ToolPageWrapper slug="social-media-image-resizer"><SocialMediaImageResizerTool /></ToolPageWrapper>; }
