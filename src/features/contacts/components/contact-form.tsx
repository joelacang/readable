import { zodResolver } from "@hookform/resolvers/zod";
import { ContactRole } from "@prisma/client";
import {
  ArrowRightIcon,
  AtSignIcon,
  BriefcaseIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import FormActionButton from "~/components/form-action-button";
import InputIcon from "~/components/input-icon";
import { DialogFooter } from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  addressDefaultValues,
  createContactSchema,
  type ContactAddressType,
  type CreateContactFormType,
} from "~/zod-schemas/contact";
import { useContactFormDialog } from "../hooks/use-contact-form-dialog";
import AddressForm from "./address-form";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import Toast from "~/components/toast";
import { ModeType } from "~/types/component";
import { Button } from "~/components/ui/button";
import { useContactDetailDialog } from "../hooks/use-contact-detail-dialog";
import { isEmptyAddress } from "~/utils/get-values";

const ContactForm = () => {
  const {
    onClose,
    onPending,
    onCompleted,
    canAddContactToOrg,
    onContactAdded,
  } = useContactFormDialog();
  const { onOpen: openContactDetails } = useContactDetailDialog();
  const { mutate: createContact, isPending: isCreatingContact } =
    api.contact.create.useMutation();

  const isPending = isCreatingContact;

  const form = useForm<CreateContactFormType>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      role: "OTHER",
      address: addressDefaultValues,
    },
  });

  const onSubmit = (values: CreateContactFormType) => {
    const newAddress =
      values.address && isEmptyAddress(values.address)
        ? undefined
        : values.address;

    const createContactToast = toast.loading(`Creating Contact...`);
    onPending();

    createContact(
      { ...values, address: newAddress },
      {
        onSuccess: (response) => {
          toast.custom(() => (
            <Toast
              title="Contact Created"
              message={`Contact '${response.name}' was created successfully.`}
              mode={ModeType.SUCCESS}
              footer={
                <>
                  {!canAddContactToOrg && (
                    <Button onClick={() => openContactDetails(response)}>
                      Go to Contact
                      <ArrowRightIcon />
                    </Button>
                  )}
                </>
              }
            />
          ));

          if (canAddContactToOrg) {
            onContactAdded(response);
          }

          form.reset();
          onClose();
        },
        onError: (error) => {
          toast.error(`Error creating contact: ${error.message}`);
        },
        onSettled: () => {
          toast.dismiss(createContactToast);
          onCompleted();
        },
      },
    );
  };

  const handleAddressChange = (value: ContactAddressType) => {
    form.setValue("address", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[60vh] space-y-2 overflow-y-auto px-2">
          <div className="space-y-4 pb-4">
            <p className="text-muted-foreground font-mono text-xs leading-none font-semibold">
              CONTACT INFORMATION
            </p>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <InputIcon
                      placeholder="Enter Contact Name *"
                      icon={UserIcon}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="leading-none" />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputIcon
                      placeholder="Enter E-mail Address *"
                      icon={AtSignIcon}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputIcon
                      placeholder="Enter Phone Number*"
                      icon={PhoneIcon}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="position"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputIcon
                      placeholder="Enter Position (optional)"
                      icon={BriefcaseIcon}
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
                  <FormControl>
                    <Textarea
                      className="h-24 text-sm"
                      placeholder="Enter Description (optional)"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AddressForm
                    value={field.value ?? addressDefaultValues}
                    onChange={handleAddressChange}
                    errors={form.formState.errors.address}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="role"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isPending}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ContactRole).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-4">
          <FormActionButton mode="create" isPending={isPending} />
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ContactForm;
