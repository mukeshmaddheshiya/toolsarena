import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RobotsTxtGeneratorTool } from './RobotsTxtGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('robots-txt-generator')!); }
export default function RobotsTxtGeneratorPage() { return <ToolPageWrapper slug="robots-txt-generator"><RobotsTxtGeneratorTool /></ToolPageWrapper>; }
