import { makeToolGuideRoute } from '@/lib/tool-guide-route';
const route = makeToolGuideRoute('markdown-formatter');
export const dynamicParams = false;
export const { generateStaticParams, generateMetadata } = route;
export default route.default;
