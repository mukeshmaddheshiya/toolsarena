import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { VehicleNumberPlateInfoTool } from './VehicleNumberPlateInfoTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('vehicle-number-plate-info')!);
}

export default function VehicleNumberPlateInfoPage() {
  return (
    <ToolPageWrapper slug="vehicle-number-plate-info">
      <VehicleNumberPlateInfoTool />
    </ToolPageWrapper>
  );
}
