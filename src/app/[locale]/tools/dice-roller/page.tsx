import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { DiceRollerTool } from './DiceRollerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('dice-roller')!);
}
export default function DiceRollerPage() {
  return <ToolPageWrapper slug="dice-roller"><DiceRollerTool /></ToolPageWrapper>;
}
