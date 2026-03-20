import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SecureNotesTool } from './SecureNotesTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('secure-notes')!);
}

export default function SecureNotesPage() {
  return (
    <ToolPageWrapper slug="secure-notes">
      <SecureNotesTool />
    </ToolPageWrapper>
  );
}
