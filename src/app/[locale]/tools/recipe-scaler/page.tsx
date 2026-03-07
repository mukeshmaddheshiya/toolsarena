import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RecipeScalerTool } from './RecipeScalerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('recipe-scaler')!);
}

export default function RecipeScalerPage() {
  return (
    <ToolPageWrapper slug="recipe-scaler">
      <RecipeScalerTool />
    </ToolPageWrapper>
  );
}
