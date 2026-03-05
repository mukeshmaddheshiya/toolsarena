import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HtmlCssJsEditorTool } from './HtmlCssJsEditorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('html-css-js-editor')!); }
export default function HtmlCssJsEditorPage() { return <ToolPageWrapper slug="html-css-js-editor"><HtmlCssJsEditorTool /></ToolPageWrapper>; }
