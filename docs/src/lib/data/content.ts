import type { Topic } from '$lib/types/content';
import data from './json/drapl.json';

// Optional: Runtime validation with zod (uncomment to enable)
// import { z } from 'zod';
// const TopicSchema = z.object({
//   topic: z.string(),
//   sections: z.array(
//     z.object({
//       id: z.string(),
//       title: z.string(),
//       intro: z.string(),
//       subtopics: z.array(
//         z.object({
//           title: z.string(),
//           blocks: z.array(
//             z.object({
//               type: z.enum(['text', 'code', 'note']),
//               value: z.string(),
//               kind: z
//                 .enum(['error', 'info', 'info-square', 'success', 'warning', 'warning-alt'])
//                 .optional(),
//               message: z.string().optional()
//             })
//           )
//         })
//       )
//     })
//   )
// });
// const linuxguide: Topic[] = TopicSchema.array().parse(data.linuxguide);

const drapl: Topic[] = data.drapl as Topic[];

export default drapl;