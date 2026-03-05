import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CountdownTimerTool } from './CountdownTimerTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('countdown-timer')!); }
export default function Page() { return <ToolPageWrapper slug="countdown-timer"><CountdownTimerTool /></ToolPageWrapper>; }
