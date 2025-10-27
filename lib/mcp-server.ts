import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { dbOperations } from './db';
import { storageOperations } from './storage';

export function createMcpServer(baseUrl: string) {
  const server = new McpServer({
    name: 'md-share-server',
    version: '1.0.0',
  });

  // Register the share_markdown tool
  server.registerTool(
    'share_markdown',
    {
      title: 'Share Markdown File',
      description: 'Share a markdown file and get a public URL that expires in 30 days',
      inputSchema: {
        content: z.string().describe('The markdown content to share'),
        filename: z.string().optional().describe('Optional filename for the markdown file'),
      },
      outputSchema: {
        url: z.string(),
        id: z.string(),
        expiresAt: z.number(),
      },
    },
    async ({ content, filename }) => {
      try {
        // Generate unique ID
        const id = nanoid(10);

        // Save markdown file
        storageOperations.saveMarkdown(id, content);

        // Save metadata to database
        const share = dbOperations.createShare(
          id,
          filename || 'untitled.md'
        );

        // Construct share URL
        const shareUrl = `${baseUrl}/${id}`;

        const output = {
          url: shareUrl,
          id: share.id,
          expiresAt: share.expires_at,
        };

        return {
          content: [
            {
              type: 'text',
              text: `✓ Markdown file shared successfully!\n\nURL: ${shareUrl}\nExpires: ${new Date(share.expires_at).toLocaleString()}\n\nShare this link to give others access to your markdown file.`,
            },
          ],
          structuredContent: output,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: `✗ Failed to share markdown file: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}

