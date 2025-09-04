import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon, Loader2Icon, PencilIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { SiWattpad } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
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
import FieldLabelSection from "~/features/form/components/field-label-section";
import {
  createAuthorSchema,
  type AuthorFormDataType,
} from "~/zod-schemas/author";
import { useAuthorFormDialog } from "../hooks/use-author-form-dialog";
import DateSelect from "~/components/date-select";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useEffect } from "react";

const AuthorForm = () => {
  const { mutate: createAuthor, isPending: isCreatingAuthor } =
    api.author.create.useMutation();
  const {
    onAuthorCreated,
    onClose,
    pendingName,
    onCreateAuthorOption,
    onFormValidated,
    skipConfirm,
    onFormPending,
    onFormRequestCompleted,
  } = useAuthorFormDialog();
  const form = useForm<AuthorFormDataType>({
    resolver: zodResolver(createAuthorSchema),
    defaultValues: {
      name: pendingName ?? "",
      biography: "",
      website: "",
      birthDate: new Date(),
      nationality: "",
      facebook: "",
      instagram: "",
      xTwitter: "",
      tiktok: "",
      wattpad: "",
    },
  });
  const isPending = isCreatingAuthor;

  useEffect(() => {
    if (form.formState.isValid) {
      onFormValidated();
    }
  }, [form.formState.isValid, onFormValidated]);
  const onSubmit = (values: AuthorFormDataType) => {
    const createAuthorToast = toast.loading("Creating Author...");
    onFormPending();

    createAuthor(values, {
      onSuccess: (response) => {
        toast.success(`Author ${response.name} successfully created.`);

        form.reset();

        if (skipConfirm) {
          onCreateAuthorOption({
            id: response.id,
            name: response.name,
            mode: "create",
          });
          onClose();
        } else {
          onAuthorCreated({
            id: "some-random-id",
            name: values.name,
            image: "image address here",
          });
        }
      },
      onError: (error) => {
        toast.error(`Error creating author ${values.name}: ${error.message}`);
      },
      onSettled: () => {
        toast.dismiss(createAuthorToast);
        onFormRequestCompleted();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4">
          <div className="flex w-full items-center justify-center">
            <div className="relative w-fit">
              <Avatar className="size-24">
                <AvatarImage src="/images/avatar-placeholder.jpg" />
              </Avatar>
              <div className="absolute right-0 bottom-0">
                <Button
                  type="button"
                  className="!size-8 rounded-full p-2"
                  size="sm"
                  disabled={isPending}
                >
                  <PencilIcon />
                </Button>
              </div>
            </div>
          </div>

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection isRequired>Name</FieldLabelSection>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="(e.g.: John Smith)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="birthDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Birth Date
                </FieldLabelSection>
                <DateSelect
                  onDateChange={field.onChange}
                  maxYear={new Date().getFullYear()}
                  initialDate={field.value} // Example initial date
                  isError={!!form.formState.errors.birthDate}
                  disabled={isPending}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="biography"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Biography
                </FieldLabelSection>
                <FormControl>
                  <Textarea
                    className="min-h-[124px]"
                    placeholder="Enter Author Biography"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="website"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Website
                </FieldLabelSection>
                <FormControl>
                  <Input
                    placeholder="e.g.: http://www.mywebsite.com"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="nationality"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabelSection displayOptionalText>
                  Nationality
                </FieldLabelSection>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="e. g.: American"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="space-y-3 rounded-xl border p-4">
            <h3 className="text-primary font-semibold">Social Media</h3>
            <FormField
              name="facebook"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-start gap-4">
                  <FaFacebook className="size-4" />
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Facebook Link (optional)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="instagram"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-start gap-4">
                  <FaInstagram className="size-4" />
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Instagram Link (optional)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="xTwitter"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-start gap-4">
                  <FaXTwitter className="size-4" />
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="X Account Link (optional)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="tiktok"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-start gap-4">
                  <FaTiktok className="size-4" />
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="tiktok Link (optional)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="wattpad"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-start gap-4">
                  <SiWattpad className="size-4" />
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Wattpad Link (optional)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter className="pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button disabled={isPending}>
            {isPending && <Loader2Icon className="mr-2 animate-spin" />}
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AuthorForm;
