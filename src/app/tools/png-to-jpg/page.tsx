import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PNGToJPGTool } from './PNGToJPGTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('png-to-jpg')!); }
export default function PNGToJPGPage() { return <ToolPageWrapper slug="png-to-jpg"><PNGToJPGTool /></ToolPageWrapper>; }
