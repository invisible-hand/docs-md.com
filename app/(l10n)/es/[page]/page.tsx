import { makeLocaleRoute } from '@/lib/locale-route';
const route = makeLocaleRoute('es');
export const dynamicParams = false;
export const { generateStaticParams, generateMetadata } = route;
export default route.default;
