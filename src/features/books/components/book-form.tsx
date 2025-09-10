"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import InfoPopover from "~/components/info-popover";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { SelectAuthor } from "~/features/authors/components/author-select";
import KeywordInput from "~/components/keyword-input";
import { useAuthorFormDialog } from "~/features/authors/hooks/use-author-form-dialog";
import { CategorySelect } from "~/features/categories/components/category-select";
import { useCategoryDialog } from "~/features/categories/hooks/use-category-dialog";
import FieldLabelSection from "~/features/form/components/field-label-section";
import FormCard from "~/features/form/components/form-card";
import FormSelectField from "~/features/form/components/form-select-field";
import { SeriesSelect } from "~/features/series/components/series-select";
import { useSeriesDialog } from "~/features/series/hooks/use-series-dialog";
import { TagSelect } from "~/features/tags/components/tag-select";
import { type LinkDetailType } from "~/types/component";
import {
  fileArrayToFileList,
  fromSelectOptions,
  toSelectOptions,
} from "~/utils/get-values";
import {
  createBookSchema,
  type BookEditData,
  type BookFormData,
} from "~/zod-schemas/book";
import { api } from "~/trpc/react";
import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import UploadImageContainer from "~/features/storage/components/upload-image-container";
import AddImageButton from "~/features/storage/components/add-image-button";
import { useTempImages } from "~/features/storage/hooks/use-temp-images";
import { useUploadFiles } from "~/features/storage/hooks/use-upload-file";
import FormActionButton from "~/components/form-action-button";
import { BookFormat } from "@prisma/client";
import FormSingleSelectField from "~/features/form/components/form-single-select-field";
import cuid from "cuid";
import type { BookPreview } from "~/types/book";

interface Props {
  book?: BookEditData;
  onSubmitForm: (data: BookPreview) => void;
  onUploadingChange: (uploading: boolean) => void;
  onGetSubmittedImages: (images: LinkDetailType[]) => void;
}

const BookForm = ({
  book,
  onSubmitForm,
  onUploadingChange,
  onGetSubmittedImages,
}: Props) => {
  const [openFileBrowser, setOpenFileBrowser] = useState(false);

  const seriesDialog = useSeriesDialog();
  const authorDialog = useAuthorFormDialog();
  const categoryDialog = useCategoryDialog();

  const { mutate: createBook, isPending: isCreatingBook } =
    api.book.create.useMutation();
  const { mutate: createImages, isPending: isCreatingImages } =
    api.image.createBookImages.useMutation();
  const { mutate: updateBook, isPending: isUpdatingBook } =
    api.book.update.useMutation();

  const {
    images,
    onAddStoredImages,
    onClear: onClearTempImages,
  } = useTempImages();
  const router = useRouter();
  const { uploadImages } = useUploadFiles();
  const isPending = isCreatingImages || isCreatingBook || isUpdatingBook;

  const form = useForm<BookFormData>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: book?.title ?? "",
      subtitle: book?.subtitle ?? "",
      description: book?.description ?? "",
      isbn: book?.isbn ?? "",
      isbn13: book?.isbn13 ?? "",
      publisher: book?.publisher ?? "",
      publishedDate: book?.publishedDate ?? new Date(),
      pageCount: book?.pageCount ?? 0,
      wordCount: book?.wordCount ?? 0,
      readingTime: book?.readingTime ?? 0,
      ageRating: book?.ageRating ?? undefined,
      metaTitle: book?.metaTitle ?? "",
      metaDescription: book?.metaDescription ?? "",
      contentWarnings: book?.contentWarnings ?? [],
      keywords: book?.keywords ?? [],
      tags: book?.tags ?? [],
      authors: book?.authors ?? [],
      categories: book?.categories ?? [],
      series: book?.series ?? [],
      variants: book?.variants.length
        ? book?.variants
        : [
            {
              mode: "create",
              format: BookFormat.Paperback,
              title: `${book?.title ?? "Untitled Book"} - ${BookFormat.Paperback} Edition`,
              description: "",
              price: 0,
              salePrice: 0,
              stock: 0,
            },
          ],
    },
  });

  const bookTitle = form.watch("title");

  const {
    fields: variants,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const {
    fields: seriesArray,
    append: addSeries,
    remove: removeSeries,
  } = useFieldArray({
    control: form.control,
    name: "series",
  });

  useEffect(() => {
    onClearTempImages();
    if (book && book.images && Object.keys(book.images).length > 0) {
      onAddStoredImages(book.images);
    }
  }, []);

  const uploadBookImages = async (bookId: string) => {
    if (!images) return;

    onUploadingChange(true);

    const imageArray = Object.values(images).filter(
      (image) => image instanceof File,
    );

    if (imageArray.length === 0) {
      onUploadingChange(false);
      onClearTempImages();
      return;
    }

    // Step 1: Upload images to storage
    const imageList = fileArrayToFileList(imageArray);
    const uploadResponse = await uploadImages(imageList)
      .then((res) => {
        toast.success("Uploaded your images successfully.");

        const imagesToUpload = res.map((data) => ({
          name: data.key,
          size: data.size,
          url: data.ufsUrl,
        }));

        createImages(
          { bookId, images: imagesToUpload },
          {
            onSuccess: (data) => {
              toast.success("Images saved to database.");
              if (data) {
                onGetSubmittedImages(data);
              }
            },
            onError: (err) => {
              toast.error(`Failed to save images: ${err.message}`);
            },
            onSettled: () => {
              onUploadingChange(false);
            },
          },
        );
      })
      .catch((error) => {
        toast.error("Unable to upload images. Please try again.");
        console.log("Upload Error", error);
      })
      .finally(() => {
        onUploadingChange(false);
        onClearTempImages();
      });
  };

  const onCreateBook = (data: BookFormData) => {
    console.log("Form Submitted: ", data);
    const createBookToast = toast.loading("Creating Book...");

    createBook(data, {
      onSuccess: (response) => {
        if (response) {
          toast.success(`Book ${response.title} created successfully.`);

          uploadBookImages(response.id)
            .then(() => console.log("Images uploaded"))
            .catch((error) => console.error("Error uploading images:", error));

          onSubmitForm(response);
        }
        console.log(`Response createBook: `, response);
      },
      onError: (error) => {
        toast.error(`Error creating book: ${error.message}`);
      },
      onSettled: () => {
        toast.dismiss(createBookToast);
      },
    });
  };

  const onUpdateBook = (data: BookFormData) => {
    if (!book) return;

    console.log(data);
    const updateBookToast = toast.loading("Updating Book...");

    updateBook(
      { ...data, id: book.id },
      {
        onSuccess: (response) => {
          if (response) {
            toast.success(`Book ${response.title} updated successfully.`);

            uploadBookImages(response.id)
              .then(() => console.log("Images uploaded"))
              .catch((error) =>
                console.error("Error uploading images:", error),
              );

            onSubmitForm(response);
          }
        },
        onError: (error) => {
          toast.error(`Error updating book: ${error.message}`);
        },
        onSettled: () => {
          toast.dismiss(updateBookToast);
        },
      },
    );
  };

  const onSubmit = (data: BookFormData) => {
    if (book) {
      onUpdateBook(data);
    } else {
      onCreateBook(data);
    }
  };

  const handleOpenFileBrowser = () => {
    setOpenFileBrowser(true);
  };

  const handleFileBrowserOpened = () => {
    setOpenFileBrowser(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Form errors", errors);
        })}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            // prevent submission only if the Enter key is pressed in non-textarea inputs
            const isTextArea = e.target.tagName === "TEXTAREA";
            const isSubmitButton = e.target.type === "submit";
            if (!isTextArea && !isSubmitButton) {
              e.preventDefault();
            }
          }
        }}
        className="space-y-8"
      >
        <FormCard
          title="Basic Information"
          description="Essential details about the book"
        >
          <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FieldLabelSection isRequired>Title</FieldLabelSection>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Enter book title"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FieldLabelSection displayOptionalText>
                    Subtitle
                  </FieldLabelSection>
                  <FormControl>
                    <Input
                      placeholder="Enter subtitle (optional)"
                      disabled={isPending}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection isRequired>Description</FieldLabelSection>
                <FormControl>
                  <Textarea
                    placeholder="Enter book description"
                    className="min-h-[100px]"
                    disabled={isPending}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="authors"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FieldLabelSection displayOptionalText>
                    Author
                  </FieldLabelSection>
                  <FormControl>
                    <FormSelectField
                      value={field.value || []}
                      onChange={field.onChange}
                      SelectComponent={({ selectedOptions, onChange }) => (
                        <SelectAuthor
                          authorsSelected={selectedOptions}
                          onSelectAuthors={onChange}
                        />
                      )}
                      dialogHook={{
                        optionCreated: authorDialog.authorOptionCreated,
                        onRemoveOption: authorDialog.removeOption,
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @2xl:grid-cols-3">
            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FieldLabelSection displayOptionalText>
                    ISBN
                  </FieldLabelSection>
                  <FormControl>
                    <Input
                      placeholder="ISBN-10"
                      disabled={isPending}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isbn13"
              render={({ field }) => (
                <FormItem>
                  <FieldLabelSection displayOptionalText>
                    ISBN-13
                  </FieldLabelSection>
                  <FormControl>
                    <Input
                      placeholder="ISBN-13"
                      disabled={isPending}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormCard>

        <FormCard
          title="Book Variants"
          description="Book formats and pricing information"
          settings={
            <Button
              type="button"
              onClick={() =>
                addVariant({
                  mode: "create",
                  format: BookFormat.Paperback,
                  price: 0,
                  salePrice: 0,
                  stock: 0,
                  description: "",
                  title: `${bookTitle === "" ? "Untitled Book" : bookTitle} - ${BookFormat.Paperback} Edition`,
                })
              }
            >
              <PlusIcon />
            </Button>
          }
        >
          {variants.map((variant, index) => {
            const bookFormat = form.watch(`variants.${index}.format`);
            return (
              <div
                key={variant.id || index}
                className="relative space-y-4 rounded-lg border p-4"
              >
                <h3 className="text-primary text-sm">{`Book Variant ${index + 1}`}</h3>
                <div className="grid grid-cols-1 @3xl:grid-cols-3">
                  <FormField
                    name={`variants.${index}.format`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FieldLabelSection isRequired>Format</FieldLabelSection>
                        <FormControl>
                          <Select
                            value={(field.value as BookFormat) ?? "Paperback"}
                            onValueChange={(newFormat) => {
                              // update the format field
                              field.onChange(newFormat);

                              // get current variant title
                              const currentTitle =
                                form.getValues(`variants.${index}.title`) ?? "";

                              // get book title (base title)
                              const baseTitle =
                                bookTitle === "" ? "Untitled Book" : bookTitle;

                              // build new title:
                              // if current title ends with " - <oldFormat>", replace with new format
                              // else just use baseTitle - newFormat
                              const titleRegex = / - [^-]+$/; // matches ' - Format' at the end

                              const newTitle = titleRegex.test(currentTitle)
                                ? currentTitle.replace(
                                    titleRegex,
                                    ` - ${newFormat} Edition`,
                                  )
                                : `${baseTitle} - ${newFormat} Edition`;

                              // update the title field for this variant
                              form.setValue(
                                `variants.${index}.title`,
                                newTitle,
                              );
                            }}
                            disabled={isPending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose Book Format" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(BookFormat).map((format) => (
                                <SelectItem key={format} value={format}>
                                  {format}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name={`variants.${index}.title`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabelSection>Title</FieldLabelSection>
                      <FormControl>
                        <Input
                          placeholder=""
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`variants.${index}.description`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabelSection displayOptionalText>
                        Description
                      </FieldLabelSection>
                      <FormControl>
                        <Textarea
                          placeholder="Enter book variant description here..."
                          className="min-h-[100px]"
                          disabled={isPending}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-3">
                  <FormField
                    name={`variants.${index}.price`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FieldLabelSection isRequired>Price:</FieldLabelSection>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`variants.${index}.salePrice`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FieldLabelSection displayOptionalText>
                          Sale Price:
                        </FieldLabelSection>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={isPending}
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {bookFormat !== "Digital" && (
                    <FormField
                      name={`variants.${index}.stock`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FieldLabelSection displayOptionalText>
                            Stock:
                          </FieldLabelSection>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={isPending}
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full"
                  onClick={() => removeVariant(index)}
                >
                  <XIcon />
                </Button>
              </div>
            );
          })}
          {form.formState.errors.variants && (
            <p className="text-destructive text-sm">
              {form.formState.errors.variants.root?.message}
            </p>
          )}
        </FormCard>

        <FormCard
          title="Book Details"
          description=" Additional information about the book"
        >
          <div>
            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <FormItem className="@2xl:col-span-4">
                  <FieldLabelSection displayOptionalText>
                    Publisher
                  </FieldLabelSection>
                  <FormControl>
                    <Input
                      placeholder="Publisher Name"
                      disabled={isPending}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div>
              <FormField
                control={form.control}
                name="publishedDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FieldLabelSection>Published Date</FieldLabelSection>
                    <DateSelect
                      onDateChange={field.onChange}
                      maxYear={new Date().getFullYear()}
                      initialDate={field.value} // Example initial date
                      isError={!!form.formState.errors.publishedDate}
                      disabled={isPending}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g: English"
                        disabled={isPending}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </div>
          {/* <div>
            <FormField
              control={form.control}
              name="pageCount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabelSection displayOptionalText>
                    Page Count
                  </FieldLabelSection>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isPending}
                      step={1}
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wordCount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabelSection displayOptionalText>
                    Word Count
                  </FieldLabelSection>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isPending}
                      step={1}
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="readingTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabelSection displayOptionalText>
                    Reading Time
                  </FieldLabelSection>
                  <FormControl>
                    <Input
                      type="number"
                      step={1}
                      placeholder="0"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="ageRating"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabelSection displayOptionalText>
                    Age Rating
                  </FieldLabelSection>
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger disabled={isPending}>
                        <SelectValue placeholder="Select Age Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(AgeRating).map((rating) => (
                          <SelectItem key={rating} value={rating}>
                            {rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentWarnings"
              render={({ field }) => (
                <FormItem className="w-full @lg:col-span-2">
                  <FieldLabelSection displayOptionalText>
                    Content Warnings
                  </FieldLabelSection>
                  <FormControl>
                    <KeywordInput
                      disabled={isPending}
                      placeholder="Violence, Language, etc. (comma-separated)"
                      keywords={field.value}
                      onKeywordChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
        </FormCard>

        <FormCard
          title="Book Classification"
          description="Define where your book belongs and how it should be found."
        >
          <div className="flex flex-col gap-4 @lg:flex-row">
            <div className="flex-1 space-y-2">
              <div className="flex w-full items-center justify-end">
                <Button
                  variant="link"
                  size="sm"
                  type="button"
                  onClick={() =>
                    addSeries({
                      id: cuid(),
                      mode: "create",
                      name: `Book Series ${seriesArray.length + 1}`,
                      order: 0,
                    })
                  }
                >
                  <PlusIcon />
                  Add Series
                </Button>
              </div>
              {seriesArray.map((series, index) => (
                <div key={index} className="relative flex flex-col gap-2">
                  <div className="flex flex-col items-center justify-between gap-4 rounded-lg border p-4 lg:flex-row">
                    <FormField
                      name={`series.${index}`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FieldLabelSection displayOptionalText>
                            Book Series
                          </FieldLabelSection>
                          <FormControl>
                            <FormSingleSelectField
                              formId={series.id}
                              value={field.value || []}
                              onChange={field.onChange}
                              SelectComponent={({
                                selectedOption,
                                onChange,
                              }) => (
                                <SeriesSelect
                                  seriesSelected={selectedOption}
                                  onSelectSeries={onChange}
                                  formId={series.id}
                                />
                              )}
                              dialogHook={{
                                optionCreated: seriesDialog.createdSeries,
                                onRemoveOption: seriesDialog.onRemoveOption,
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`series.${index}.order`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FieldLabelSection>
                            Series Book Order
                          </FieldLabelSection>
                          <FormControl>
                            <Input
                              className="h-[38px]"
                              type="number"
                              value={field.value ?? 0}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      className="size-fit rounded-full p-2"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSeries(index)}
                      type="button"
                    >
                      <XIcon className="!size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <FormField
            name="categories"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Category
                  <InfoPopover>
                    Category defines the primary genre or subject of your book.
                    Choose the option that best represents the book’s overall
                    theme.
                  </InfoPopover>
                </FieldLabelSection>
                <FormControl>
                  <FormSelectField
                    value={field.value || []}
                    onChange={field.onChange}
                    SelectComponent={({ selectedOptions, onChange }) => (
                      <CategorySelect
                        categoriesSelected={selectedOptions}
                        onSelectCategories={onChange}
                      />
                    )}
                    dialogHook={{
                      optionCreated: categoryDialog.createdCategoryOption,
                      onRemoveOption: categoryDialog.removeCreatedCategory,
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="tags"
            control={form.control}
            render={({ field }) => {
              const selectedTagOptions = toSelectOptions(field.value);
              return (
                <FormItem>
                  <FieldLabelSection displayOptionalText>
                    Tags
                  </FieldLabelSection>
                  <FormControl>
                    <TagSelect
                      tagsSelected={selectedTagOptions}
                      onSelectTags={(options) => {
                        field.onChange(fromSelectOptions(options));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </FormCard>

        <FormCard
          title="Book Images"
          description="Add a compelling cover image and additional photos to showcase your book and attract potential readers."
          settings={
            images &&
            Object.keys(images).length > 0 && (
              <AddImageButton onAddImage={handleOpenFileBrowser} />
            )
          }
        >
          <UploadImageContainer
            openFileBrowser={openFileBrowser}
            onFileBrowserOpened={handleFileBrowserOpened}
          />
        </FormCard>

        <FormCard
          title="SEO Metadata"
          description="Optimize how this book appears in search engines and social platforms."
        >
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Meta Title
                </FieldLabelSection>
                <FormControl>
                  <Input
                    placeholder="Short, descriptive title (max 60 characters)"
                    disabled={isPending}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Meta Description
                </FieldLabelSection>
                <FormControl>
                  <Textarea
                    placeholder="Brief description for search results (max 160 characters)"
                    className="min-h-[80px]"
                    disabled={isPending}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Keywords
                </FieldLabelSection>
                <FormControl>
                  <KeywordInput
                    placeholder="Comma-separated keywords (e.g., fiction, mystery, thriller)"
                    disabled={isPending}
                    keywords={field.value}
                    onKeywordChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormCard>

        <div className="flex justify-end space-x-4">
          <Button type="button" onClick={onClearTempImages}>
            Clear Images
          </Button>
          <Button type="button" variant="outline" disabled={isPending}>
            {isPending && <Loader2Icon className="mr-2 animate-spin" />}
            Save as Draft
          </Button>
          <FormActionButton
            mode={book ? "update" : "create"}
            isPending={isPending}
          />
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
