import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PdfEditorTool } from './PdfEditorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('pdf-editor')!); }
export default function PdfEditorPage() { return <ToolPageWrapper slug="pdf-editor"><PdfEditorTool /></ToolPageWrapper>; }
