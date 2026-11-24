import { makeToolGuideRoute } from '@/lib/tool-guide-route';
const route = makeToolGuideRoute('mcp-config-generator');
export const dynamicParams = false;
export const { generateStaticParams, generateMetadata } = route;
export default route.default;
