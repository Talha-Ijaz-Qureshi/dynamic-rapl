export type BlockType = 'text' | 'code' | 'note';

export interface Block {
  type: BlockType;
  value: string;
  kind?: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
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

const sections: Section[] = [
  {
    id: 'test',
    title: 'Main Title: Testing',
    intro:'Intro: The content rendering pattern is dynamic!',
    subtopics: [
      {
        title: 'Subsection Title: Testing',
        blocks: [
        { 
            type: 'text', 
            value: 'Each section can have multiple subtopics, and each subtopic can have multiple blocks of content. The blocks can be of different types, such as text, code, or note.' 
        },
        { 
            type: 'code', 
            value: 'console.log("Hello, world!");' 
        },
        {
            type: 'note', 
            value: 'This is a note block.', 
            kind: 'info', 
            message: 'This is an info note.' 
        },
        { 
            type: 'note', 
            value: 'This is an error note.', 
            kind: 'error', 
            message: 'This is an error note.'
        },
        { 
            type: 'note', 
            value: 'This is a success note.', 
            kind: 'success', 
            message: 'This is a success note.' 
        },
        { 
            type: 'note', 
            value: 'This is a warning note.', 
            kind: 'warning', 
            message: 'This is a warning note.' 
        },
        { 
            type: 'note', 
            value: 'This is a warning-alt note.', 
            kind: 'warning-alt', 
            message: 'This is a warning-alt note.' 
        }
        ]
      },
      {
        title: 'Subsection Title 2: Testing',
        blocks: [
          { 
            type: 'text', 
            value: 'This is the second subsection.' 
          },
          { 
            type: 'code', 
            value: 'console.log("Hello, world!");' 
          },
          {
            type: 'note', 
            value: 'This is a note block.', 
            kind: 'info', 
            message: 'This is an info note.' 
          }
        ]
      }
    ]
  },
  {
    id: 'test2',
    title: 'Main Title 2: Testing',
    intro:'Intro: The content rendering pattern is dynamic!',
    subtopics: [
      {
        title: 'Subsection Title 3: Testing',
        blocks: [
          { 
            type: 'text', 
            value: 'This is the third subsection.' 
          },
          { 
            type: 'code', 
            value: 'console.log("Hello, world!");' 
          },
          {
            type: 'note', 
            value: 'This is a note block.', 
            kind: 'info', 
            message: 'This is an info note.' 
          }
        ]
      }
    ]
  }
]

export default { sections };
