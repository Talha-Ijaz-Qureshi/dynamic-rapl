export type BlockType = 'text' | 'code' | 'note';

export interface Block {
  type: BlockType;
  value: string;
  kind?: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
  codeBlock?: "inline" | "multi" | "single" | undefined;
  message?: string;
}

export interface Subtopic {
  title: string;
  blocks: Block[];
}

export interface Section {
  id: string;
  title: string;
  intro: string;
  subtopics: Subtopic[];
}

export interface Topic {
  topic: string;
  sections: Section[];
}
