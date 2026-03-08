import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BloodPressureTrackerTool } from './BloodPressureTrackerTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('blood-pressure-tracker')!); }
export default function Page() { return <ToolPageWrapper slug="blood-pressure-tracker"><BloodPressureTrackerTool /></ToolPageWrapper>; }
