import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ResignationLetterGeneratorTool } from './ResignationLetterGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('resignation-letter-generator')!);
}

export default function Page() {
  return (
    <ToolPageWrapper slug="resignation-letter-generator">
      <ResignationLetterGeneratorTool />
    </ToolPageWrapper>
  );
}
