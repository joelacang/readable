import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationType } from "@prisma/client";
import { GlobeIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import FormActionButton from "~/components/form-action-button";
import InputIcon from "~/components/input-icon";
import { DialogFooter } from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import AddressForm from "~/features/contacts/components/address-form";
import ContactPersonForm from "~/features/contacts/components/contact-person-form";
import FieldLabelSection from "~/features/form/components/field-label-section";
import FormHeaderDialog from "~/features/form/components/form-header-dialog";
import { generateId } from "~/utils/get-values";
import {
  addressDefaultValues,
  type ContactAddressType,
} from "~/zod-schemas/contact";
import {
  createOrgSchema,
  type CreateOrgFormType,
} from "~/zod-schemas/organization";

const OrganizationForm = () => {
  const orgTempId = generateId(12);
  const isPending = false;
  const form = useForm<CreateOrgFormType>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "OTHER",
      description: "",
      website: "",
      phoneAlt: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      contactIds: [],
    },
  });

  const onSubmit = (values: CreateOrgFormType) => {
    console.log(values);
  };

  const handleAddressChange = (value: ContactAddressType) => {
    form.setValue("address", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-h-[calc(100vh-12rem)] w-full max-w-2xl space-y-8 overflow-y-auto px-4 pb-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <FormHeaderDialog title="BASIC INFORMATION" />
            <div className="grid grid-cols-1 items-start justify-items-start gap-4 pt-2 md:grid-cols-2">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FieldLabelSection isRequired>
                      Organization Name
                    </FieldLabelSection>
                    <FormControl>
                      <InputIcon
                        icon={UserIcon}
                        placeholder="Enter organization name"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FieldLabelSection isRequired>
                      Organization Type
                    </FieldLabelSection>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select organization type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(OrganizationType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabelSection displayOptionalText>
                    Description
                  </FieldLabelSection>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the organization"
                      disabled={isPending}
                      className="h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <FormHeaderDialog title="CONTACT INFORMATION" />

            <div className="grid grid-cols-1 items-start justify-items-start gap-4 pt-2 md:grid-cols-2">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FieldLabelSection isRequired>
                      Email Address
                    </FieldLabelSection>
                    <FormControl>
                      <InputIcon
                        icon={MailIcon}
                        placeholder="contact@organization.com"
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
                  <FormItem className="w-full">
                    <FieldLabelSection displayOptionalText>
                      Website
                    </FieldLabelSection>
                    <FormControl>
                      <InputIcon
                        icon={GlobeIcon}
                        placeholder="https://www.organization.com"
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
                  <FormItem className="w-full">
                    <FieldLabelSection isRequired>
                      Primary Phone
                    </FieldLabelSection>
                    <FormControl>
                      <InputIcon
                        icon={PhoneIcon}
                        placeholder="(123) 456-7890"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="phoneAlt"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FieldLabelSection displayOptionalText>
                      Alternate Phone
                    </FieldLabelSection>
                    <FormControl>
                      <InputIcon
                        icon={PhoneIcon}
                        placeholder="(123) 456-7890"
                        disabled={isPending}
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <FormHeaderDialog title="ADDRESS INFORMATION" />

            <div className="pt-2">
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
            </div>
          </div>

          {/* Contact Persons Section */}
          <div className="space-y-4">
            <FormHeaderDialog title="CONTACT PERSONS" />
            <FormField
              name="contactIds"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ContactPersonForm
                      orgTempId={orgTempId}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <DialogFooter className="pt-4">
          <FormActionButton mode="create" isPending={isPending}>
            Create Organization
          </FormActionButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default OrganizationForm;
