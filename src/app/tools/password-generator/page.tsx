import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PasswordGeneratorTool } from './PasswordGeneratorTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('password-generator')!); }
export default function PasswordGeneratorPage() { return <ToolPageWrapper slug="password-generator"><PasswordGeneratorTool /></ToolPageWrapper>; }
