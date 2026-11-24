import { makeLocaleRoute } from '@/lib/locale-route';
const route = makeLocaleRoute('de');
export const dynamicParams = false;
export const { generateStaticParams, generateMetadata } = route;
export default route.default;
