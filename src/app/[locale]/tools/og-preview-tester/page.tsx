import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { OgPreviewTesterTool } from './OgPreviewTesterTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('og-preview-tester')!); }
export default function Page() { return <ToolPageWrapper slug="og-preview-tester"><OgPreviewTesterTool /></ToolPageWrapper>; }
