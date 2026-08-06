import { marked } from 'marked';

export function parseContent(content: string) {
  return marked(content, { breaks: true });
}