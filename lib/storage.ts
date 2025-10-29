import { put, del } from '@vercel/blob';

export const storageOperations = {
  saveMarkdown: async (id: string, content: string): Promise<string> => {
    const blob = await put(`${id}.md`, content, {
      access: 'public',
      contentType: 'text/markdown; charset=utf-8',
    });
    return blob.url;
  },

  readMarkdown: async (blobUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(blobUrl);
      if (!response.ok) {
        return null;
      }
      return await response.text();
    } catch (error) {
      console.error(`Error reading markdown file from ${blobUrl}:`, error);
      return null;
    }
  },

  deleteMarkdown: async (blobUrl: string): Promise<boolean> => {
    try {
      await del(blobUrl);
      return true;
    } catch (error) {
      console.error(`Error deleting markdown file ${blobUrl}:`, error);
      return false;
    }
  },
};
