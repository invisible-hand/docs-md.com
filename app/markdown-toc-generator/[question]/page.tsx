import { makeToolGuideRoute } from '@/lib/tool-guide-route';
const route = makeToolGuideRoute('markdown-toc-generator');
export const dynamicParams = false;
export const { generateStaticParams, generateMetadata } = route;
export default route.default;
