import {
  Building2Icon,
  HomeIcon,
  LandmarkIcon,
  MailIcon,
  MapIcon,
} from "lucide-react";
import type {
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";
import InputIcon from "~/components/input-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { countryValues } from "~/constants/countries";
import type { ContactAddressType } from "~/zod-schemas/contact";

interface Props {
  value: ContactAddressType;
  onChange: (value: ContactAddressType) => void;
  isPending?: boolean;
  errors?: Merge<
    FieldError,
    FieldErrorsImpl<{
      city: string;
      line1: string;
      postalCode: string;
      country: string;
      state: string;
      line2: string;
    }>
  >;
}

const AddressForm = ({ value, onChange, isPending = false, errors }: Props) => {
  return (
    <div className="space-y-3 rounded-lg border p-3">
      <p className="text-muted-foreground text-xs font-semibold">ADDRESS</p>

      <div className="space-y-2">
        <InputIcon
          placeholder="Enter Address Line 1 *"
          icon={HomeIcon}
          value={value.line1}
          onChange={(e) => onChange({ ...value, line1: e.currentTarget.value })}
          disabled={isPending}
          aria-invalid={!!errors?.line1}
        />
        {errors?.line1 && (
          <p className="text-destructive text-sm">{errors.line1.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <InputIcon
          placeholder="Enter Address Line 2 (optional)"
          icon={Building2Icon}
          value={value.line2 ?? ""}
          onChange={(e) => onChange({ ...value, line2: e.currentTarget.value })}
          disabled={isPending}
          aria-invalid={!!errors?.line2}
        />
        {errors?.line2 && (
          <p className="text-destructive text-sm">{errors.line2.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <InputIcon
          placeholder="Enter City *"
          icon={LandmarkIcon}
          value={value.city}
          onChange={(e) => onChange({ ...value, city: e.currentTarget.value })}
          disabled={isPending}
          aria-invalid={!!errors?.city}
        />
        {errors?.city && (
          <p className="text-destructive text-sm">{errors.city.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <InputIcon
            placeholder="Enter State (optional)"
            icon={MapIcon}
            value={value.state ?? ""}
            onChange={(e) =>
              onChange({ ...value, state: e.currentTarget.value })
            }
            disabled={isPending}
            aria-invalid={!!errors?.state}
          />
          {errors?.state && (
            <p className="text-destructive text-sm">{errors.state.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <InputIcon
            placeholder="Enter PostalCode*"
            icon={MailIcon}
            value={value.postalCode}
            onChange={(e) =>
              onChange({ ...value, postalCode: e.currentTarget.value })
            }
            disabled={isPending}
            aria-invalid={!!errors?.postalCode}
          />
          {errors?.postalCode && (
            <p className="text-destructive text-sm">
              {errors.postalCode.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Select
          value={value.country}
          onValueChange={(code) => onChange({ ...value, country: code })}
          disabled={isPending}
        >
          <SelectTrigger className="w-full" aria-invalid={!!errors?.country}>
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {countryValues.map((country) => (
              <SelectItem
                className="space-x-3"
                key={country.code}
                value={country.code}
              >
                <span className="hidden">{country.code}</span>
                <span>{country.emoji}</span>
                <span>{country.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.country && (
          <p className="text-destructive text-sm">{errors.country.message}</p>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
