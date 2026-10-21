import { makeLocaleRoute } from '@/lib/locale-route';
const route = makeLocaleRoute('pt-br');
export const dynamicParams = false;
export const { generateStaticParams, generateMetadata } = route;
export default route.default;
