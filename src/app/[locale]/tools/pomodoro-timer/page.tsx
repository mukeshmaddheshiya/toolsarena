import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PomodoroTimerTool } from './PomodoroTimerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('pomodoro-timer')!);
}

export default function PomodoroTimerPage() {
  return (
    <ToolPageWrapper slug="pomodoro-timer">
      <PomodoroTimerTool />
    </ToolPageWrapper>
  );
}
