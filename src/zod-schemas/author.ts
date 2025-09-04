import z from "zod";

export const createAuthorSchema = z.object({
  name: z.string().min(3).max(124),
  biography: z
    .string()
    .min(3)
    .max(512)
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
  website: z.string().url().optional().or(z.literal("")),
  nationality: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  xTwitter: z.string().optional(),
  tiktok: z.string().optional(),
  wattpad: z.string().optional(),
  birthDate: z
    .date({
      invalid_type_error: "Please provide a valid date",
    })
    .refine(
      (date) => {
        const today = new Date();
        return date <= today;
      },
      {
        message: "Birthdate cannot be in the future",
      },
    )
    .refine(
      (date) => {
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 150); // 150 years ago
        return date >= minDate;
      },
      {
        message: "Birthdate cannot be more than 150 years ago",
      },
    )
    .refine(
      (date) => {
        const minAge = new Date();
        minAge.setFullYear(minAge.getFullYear() - 13); // Must be at least 13 years old
        return date <= minAge;
      },
      {
        message: "You must be at least 13 years old",
      },
    )
    .optional(),
});

export type AuthorFormDataType = z.infer<typeof createAuthorSchema>;
