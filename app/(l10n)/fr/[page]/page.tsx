import { makeLocaleRoute } from '@/lib/locale-route';
const route = makeLocaleRoute('fr');
export const dynamicParams = false;
export const { generateStaticParams, generateMetadata } = route;
export default route.default;
