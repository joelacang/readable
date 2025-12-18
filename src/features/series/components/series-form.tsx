import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { SelectAuthor } from "~/features/authors/components/author-select";
import FieldLabelSection from "~/features/form/components/field-label-section";
import { api } from "~/trpc/react";
import { bookSeriesSchema, type SeriesFormData } from "~/zod-schemas/book";
import { useSeriesDialog } from "../hooks/use-series-dialog";
import { useEffect } from "react";
import toast from "react-hot-toast";
import FormSelectField from "~/features/form/components/form-select-field";
import { useAuthorFormDialog } from "~/features/authors/hooks/use-author-form-dialog";

const SeriesForm = () => {
  const { mutate: createSeries, isPending } = api.series.create.useMutation();
  const authorDialog = useAuthorFormDialog();
  const {
    onClose,
    onFormValidated,
    onFormPending,
    createOption,
    optionLabel,
    onCreateSeriesOption,
    onFormRequestCompleted,
  } = useSeriesDialog();

  const form = useForm<SeriesFormData>({
    resolver: zodResolver(bookSeriesSchema),
    defaultValues: {
      title: optionLabel ?? "",
      description: "",
      coverImageUrl: "",
      authors: [],
    },
  });

  useEffect(() => {
    if (form.formState.isValid) {
      onFormValidated();
    }
  }, [form.formState.isValid, onFormValidated]);

  const onSubmit = (values: SeriesFormData) => {
    const createSeriesToast = toast.loading("Creating Series...");
    onFormPending();

    createSeries(values, {
      onSuccess: (response) => {
        toast.success(`Series ${response.title} created successfully.`);
        form.reset();

        if (createOption) {
          onCreateSeriesOption({
            id: response.id,
            name: response.title,
            mode: "create",
          });
        }

        onClose();
      },
      onError: (error) => {
        toast.error(`Error creating series ${values.title}: ${error.message}`);
      },
      onSettled: () => {
        toast.dismiss(createSeriesToast);
        onFormRequestCompleted();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 p-2">
          <FormField
            name="title"
            control={form.control}
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection isRequired>Title</FieldLabelSection>
                <FormControl>
                  <Input placeholder="Enter Series Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection isRequired>Description</FieldLabelSection>
                <FormControl>
                  <Textarea
                    className="h-24"
                    placeholder="Enter Series Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="authors"
            control={form.control}
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Authors
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
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-6">
          <Button
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            {isPending && <Loader2Icon className="mr-2 animate-spin" />}
            <p>{isPending ? "Creating..." : "Create"}</p>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default SeriesForm;
