import { put, del, head } from '@vercel/blob';

export const storageOperations = {
  saveMarkdown: async (id: string, content: string): Promise<string> => {
    const blob = await put(`${id}.md`, content, {
      access: 'public',
      contentType: 'text/markdown',
    });
    return blob.url;
  },

  readMarkdown: async (id: string): Promise<string | null> => {
    try {
      // Fetch the blob content directly
      const response = await fetch(`https://docs-md-com-blob.public.blob.vercel-storage.com/${id}.md`);
      if (!response.ok) {
        return null;
      }
      return await response.text();
    } catch (error) {
      console.error(`Error reading markdown file ${id}:`, error);
      return null;
    }
  },

  deleteMarkdown: async (id: string): Promise<boolean> => {
    try {
      await del(`https://docs-md-com-blob.public.blob.vercel-storage.com/${id}.md`);
      return true;
    } catch (error) {
      console.error(`Error deleting markdown file ${id}:`, error);
      return false;
    }
  },

  fileExists: async (id: string): Promise<boolean> => {
    try {
      await head(`https://docs-md-com-blob.public.blob.vercel-storage.com/${id}.md`);
      return true;
    } catch (error) {
      return false;
    }
  },
};
