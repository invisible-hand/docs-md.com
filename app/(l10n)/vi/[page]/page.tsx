import { makeLocaleRoute } from '@/lib/locale-route';
const route = makeLocaleRoute('vi');
export const dynamicParams = false;
export const { generateStaticParams, generateMetadata } = route;
export default route.default;
