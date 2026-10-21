import { DAILY_SHARE_LIMIT_PER_IP } from '@/lib/quota';

// /openapi.json — machine-readable description of the share API for agent frameworks,
// GPT Actions and API clients. Keep in sync with app/api/share/route.ts and app/raw/[id]/route.ts.
export const dynamic = 'force-static';

const shareResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    id: { type: 'string', example: 'calm-river-Ab12C' },
    url: { type: 'string', format: 'uri', example: 'https://docs-md.com/calm-river-Ab12C' },
    rawUrl: { type: 'string', format: 'uri', example: 'https://docs-md.com/raw/calm-river-Ab12C' },
    editToken: { type: 'string', description: 'Keep it: required to update or delete the share.' },
    expiresAt: { type: 'integer', description: 'Unix time in milliseconds; 0 means the share never expires.' },
  },
};

const spec = {
  openapi: '3.1.0',
  info: {
    title: 'Docs MD share API',
    version: '1.2.0',
    description:
      `Publish markdown at a rendered public link with no account or API key. ${DAILY_SHARE_LIMIT_PER_IP} new shares per address per day, 120,000 characters per share. ` +
      'An MCP server with the same operations is at https://docs-md.com/api/mcp. Guide: https://docs-md.com/agents',
  },
  servers: [{ url: 'https://docs-md.com' }],
  paths: {
    '/api/share': {
      post: {
        operationId: 'shareMarkdown',
        summary: 'Publish markdown and get a link',
        description:
          'Send JSON, or send the raw markdown as the body (e.g. curl --data-binary @file.md) with options in the query string; a raw body gets a plain-text reply unless Accept: application/json.',
        parameters: [
          { name: 'expiry', in: 'query', schema: { type: 'string', enum: ['1d', '7d', '30d', 'never'] }, description: 'Raw-body requests only. Default 30d.' },
          { name: 'filename', in: 'query', schema: { type: 'string' }, description: 'Raw-body requests only.' },
          { name: 'client', in: 'query', schema: { type: 'string' }, description: 'Optional name of your tool or agent.' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string', maxLength: 120000, description: 'The markdown to publish' },
                  filename: { type: 'string', maxLength: 120, description: 'Shown as the page title, e.g. PLAN.md' },
                  expiry: { type: 'string', enum: ['1d', '7d', '30d', 'never'], default: '30d' },
                  client: { type: 'string', description: 'Optional name of your tool or agent' },
                },
              },
            },
            'text/markdown': { schema: { type: 'string' } },
          },
        },
        responses: {
          '200': {
            description: 'Created',
            content: {
              'application/json': { schema: shareResponse },
              'text/plain': { schema: { type: 'string', example: 'https://docs-md.com/calm-river-Ab12C\nraw: https://docs-md.com/raw/calm-river-Ab12C\nexpires: 2026-11-19\nedit-token: …\n' } },
            },
          },
          '400': { description: 'Invalid request' },
          '413': { description: 'Body too large' },
          '429': { description: 'Rate limit or daily limit reached; see Retry-After' },
        },
      },
    },
    '/api/share/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      patch: {
        operationId: 'updateShare',
        summary: 'Replace the content of a share',
        parameters: [{ name: 'x-edit-token', in: 'header', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: { content: { type: 'string' }, filename: { type: 'string' } },
              },
            },
          },
        },
        responses: { '200': { description: 'Updated' }, '403': { description: 'Wrong edit token' }, '404': { description: 'Not found or expired' } },
      },
      delete: {
        operationId: 'deleteShare',
        summary: 'Delete a share',
        parameters: [{ name: 'x-edit-token', in: 'header', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Deleted' }, '403': { description: 'Wrong edit token' }, '404': { description: 'Not found or expired' } },
      },
    },
    '/raw/{id}': {
      get: {
        operationId: 'readShare',
        summary: 'Get the markdown of a share',
        description: 'Also available as https://docs-md.com/{id}.md, or https://docs-md.com/{id} with Accept: text/markdown.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'The markdown', content: { 'text/markdown': { schema: { type: 'string' } } } },
          '404': { description: 'Not found or expired' },
        },
      },
    },
  },
};

export function GET() {
  return Response.json(spec, { headers: { 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' } });
}
