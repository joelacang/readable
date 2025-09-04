"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2Icon, PlusIcon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { createCategorySchema } from "~/zod-schemas/category";
import { useCategoryDialog } from "../hooks/use-category-dialog";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import OptionalFieldText from "~/components/optional-field-text";
import InfoPopover from "~/components/info-popover";
import FieldLabelSection from "~/features/form/components/field-label-section";
import FormActionButton from "~/components/form-action-button";

const CategoryForm = () => {
  const {
    onClose,
    name: pendingCategoryName,
    onCreateCategoryOption: onCreateCategory,
    createOption,
    parentCategory,
    currentCategory,
  } = useCategoryDialog();
  const { mutate: createCategory, isPending: isCreatingCategory } =
    api.category.create.useMutation();
  const { mutate: updateCategory, isPending: isUpdatingCategory } =
    api.category.update.useMutation();
  const utils = api.useUtils();

  const isPending = isCreatingCategory || isUpdatingCategory;
  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: currentCategory?.name ?? pendingCategoryName ?? "",
      description: currentCategory?.description ?? "",
      code: currentCategory?.code ?? "",
      parentId: currentCategory?.parentId ?? parentCategory?.id ?? undefined,
      metaTitle: currentCategory?.metaTitle ?? "",
      metaDescription: currentCategory?.metaDescription ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof createCategorySchema>) => {
    if (currentCategory) {
      const updateToast = toast.loading("Updating Category...");

      updateCategory(
        { ...values, categoryId: currentCategory.id },
        {
          onSuccess: (response) => {
            utils.category.getCategories
              .invalidate()
              .then(() => console.log("getCategories tag invalidated."))
              .catch((error) =>
                console.error("getCategories tag not invalidated", error),
              );
            toast.success(`Updated category: ${response.name}`);
            form.reset();
            onClose();
          },
          onError: (error) => {
            toast.error(`Error updating category: ${error.message}`);
          },
          onSettled: () => {
            toast.dismiss(updateToast);
          },
        },
      );
    } else {
      const creationToast = toast.loading("Creating Category...");

      createCategory(values, {
        onSuccess: (response) => {
          if (createOption) {
            onCreateCategory({
              id: response.id,
              name: response.name,
              mode: "create",
            });
          }
          utils.category.getCategories
            .invalidate()
            .then(() => console.log(`getCategories tag invalidated`))
            .catch((error) =>
              console.error(`error invalidating getCategories`, error),
            );
          toast.success(`Category ${response.name} created.`);
          form.reset();
          onClose();
        },
        onError: (error) => {
          toast.error(`Error creating category: ${error.message}`);
        },
        onSettled: () => {
          toast.dismiss(creationToast);
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form className="h-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-full max-h-[60vh] space-y-4 overflow-y-auto p-3">
          {parentCategory && (
            <div>
              <p className="text-xs">
                <span className="font-semibold">Parent Category:&nbsp;</span>
                {parentCategory.name}
              </p>
            </div>
          )}

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>

                <FormControl>
                  <Input
                    className="h-10"
                    placeholder="Enter Category Name"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Description
                </FieldLabelSection>
                <FormControl>
                  <Textarea
                    className="min-h-24"
                    placeholder="Enter Category Description"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection
                  hint="Code should be 4 characters only."
                  isRequired
                >
                  Code
                </FieldLabelSection>
                <FormControl>
                  <Input
                    className="h-10"
                    placeholder="Enter Category Code"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="metaTitle"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection
                  hint="This is for SEO use only."
                  displayOptionalText
                >
                  Meta Title
                </FieldLabelSection>

                <FormControl>
                  <Input
                    className="h-10"
                    placeholder="Enter Category Meta Title"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="metaDescription"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection
                  hint="This is for SEO use only."
                  displayOptionalText
                >
                  Meta Description
                </FieldLabelSection>
                <FormControl>
                  <Textarea
                    placeholder="Enter Category Meta Description"
                    className="h-24"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="bg-almond-100 border-primary flex flex-col items-center justify-center rounded-xl py-8">
            <ImageIcon className="!size-8" />
            <p className="text-sm">Drag your image here...</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="cursor-pointer"
            variant="outline"
            onClick={() => onClose()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <FormActionButton
            mode={currentCategory ? "update" : "create"}
            isPending={isPending}
          />
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CategoryForm;
