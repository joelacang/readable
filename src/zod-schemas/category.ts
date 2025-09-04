import z from "zod";

const emptyToUndefined = (val: string) => (val.trim() === "" ? undefined : val);
export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(64),
  code: z.string().length(4, "Code must be exactly 4 characters"),
  description: z.string().max(256).transform(emptyToUndefined).optional(),
  parentId: z
    .string()
    .transform(emptyToUndefined)
    .optional()
    .refine(
      (val) => val === undefined || z.string().cuid().safeParse(val).success,
      {
        message: "parentId must be a valid CUID",
      },
    ),
  metaTitle: z.string().transform(emptyToUndefined).optional(),
  metaDescription: z.string().transform(emptyToUndefined).optional(),
  imageUrl: z.string().transform(emptyToUndefined).optional(),
});

export const updateCategorySchema = createCategorySchema.merge(
  z.object({
    categoryId: z.string().cuid({ message: "categoryId must be a valid CUID" }),
  }),
);
