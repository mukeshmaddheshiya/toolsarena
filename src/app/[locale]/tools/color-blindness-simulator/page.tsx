import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ColorBlindnessSimulatorTool } from './ColorBlindnessSimulatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('color-blindness-simulator')!);
}

export default function ColorBlindnessSimulatorPage() {
  return (
    <ToolPageWrapper slug="color-blindness-simulator">
      <ColorBlindnessSimulatorTool />
    </ToolPageWrapper>
  );
}
