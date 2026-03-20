import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { JsonSchemaGeneratorTool } from './JsonSchemaGeneratorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('json-schema-generator')!);
}

export default function JsonSchemaGeneratorPage() {
  return (
    <ToolPageWrapper slug="json-schema-generator">
      <JsonSchemaGeneratorTool />
    </ToolPageWrapper>
  );
}
