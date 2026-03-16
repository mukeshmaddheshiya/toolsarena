import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { EmojiPickerTool } from './EmojiPickerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('emoji-picker')!);
}
export default function EmojiPickerPage() {
  return <ToolPageWrapper slug="emoji-picker"><EmojiPickerTool /></ToolPageWrapper>;
}
