import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RedactPdfTool } from './RedactPdfTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('redact-pdf')!); }
export default function RedactPdfPage() { return <ToolPageWrapper slug="redact-pdf"><RedactPdfTool /></ToolPageWrapper>; }
