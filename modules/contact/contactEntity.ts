import { z } from "zod";

export const contactsSchema = z
  .object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    phones: z.array(
      z.object({
        id: z.number(),
        number: z.string(),
      })
    ),
  })
  .array();

export type Contact = z.infer<typeof contactsSchema>;
