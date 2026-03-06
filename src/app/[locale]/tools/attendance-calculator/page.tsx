import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AttendanceCalculatorTool } from './AttendanceCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('attendance-calculator')!);
}
export default function AttendanceCalculatorPage() {
  return <ToolPageWrapper slug="attendance-calculator"><AttendanceCalculatorTool /></ToolPageWrapper>;
}
