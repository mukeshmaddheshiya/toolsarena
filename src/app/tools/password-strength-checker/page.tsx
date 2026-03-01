import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PasswordStrengthCheckerTool } from './PasswordStrengthCheckerTool';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('password-strength-checker')!); }
export default function Page() { return <ToolPageWrapper slug="password-strength-checker"><PasswordStrengthCheckerTool /></ToolPageWrapper>; }
