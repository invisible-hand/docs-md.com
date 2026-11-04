import type { Metadata } from 'next';
import { SITE_METADATA } from '@/components/SiteShell';
import { makeLocaleLayout } from '@/lib/locale-layout';

export const metadata: Metadata = SITE_METADATA;
export default makeLocaleLayout('pt-br');
