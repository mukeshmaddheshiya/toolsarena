import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ExifMetadataRemoverTool } from './ExifMetadataRemoverTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('exif-metadata-remover')!); }
export default function ExifMetadataRemoverPage() { return <ToolPageWrapper slug="exif-metadata-remover"><ExifMetadataRemoverTool /></ToolPageWrapper>; }
