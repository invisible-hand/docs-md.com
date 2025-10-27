import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const storageOperations = {
  saveMarkdown: (id: string, content: string): string => {
    const filePath = path.join(uploadsDir, `${id}.md`);
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
  },

  readMarkdown: (id: string): string | null => {
    const filePath = path.join(uploadsDir, `${id}.md`);
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
      }
      return null;
    } catch (error) {
      console.error(`Error reading markdown file ${id}:`, error);
      return null;
    }
  },

  deleteMarkdown: (id: string): boolean => {
    const filePath = path.join(uploadsDir, `${id}.md`);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting markdown file ${id}:`, error);
      return false;
    }
  },

  fileExists: (id: string): boolean => {
    const filePath = path.join(uploadsDir, `${id}.md`);
    return fs.existsSync(filePath);
  },
};

