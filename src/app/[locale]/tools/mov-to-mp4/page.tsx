import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MovToMp4Tool } from './MovToMp4Tool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('mov-to-mp4')!);
}
export default function MovToMp4Page() {
  return <ToolPageWrapper slug="mov-to-mp4"><MovToMp4Tool /></ToolPageWrapper>;
}
