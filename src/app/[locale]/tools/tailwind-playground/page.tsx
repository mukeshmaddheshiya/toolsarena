import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TailwindPlaygroundTool } from './TailwindPlaygroundTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('tailwind-playground')!);
}

export default function TailwindPlaygroundPage() {
  return (
    <ToolPageWrapper slug="tailwind-playground">
      <TailwindPlaygroundTool />
    </ToolPageWrapper>
  );
}
