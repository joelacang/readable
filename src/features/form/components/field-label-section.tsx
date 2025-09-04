import type { LabelProps } from "@radix-ui/react-label";
import InfoPopover from "~/components/info-popover";
import OptionalFieldText from "~/components/optional-field-text";
import { FormLabel } from "~/components/ui/form";

interface FieldLabelSectionProps extends LabelProps {
  hint?: string;
  children: React.ReactNode;
  isRequired?: boolean;
  displayOptionalText?: boolean;
  className?: string;
}

const FieldLabelSection = ({
  hint,
  children,
  isRequired = false,
  displayOptionalText = false,
  className,
  ...props
}: FieldLabelSectionProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-6">
      <FormLabel className={className} {...props}>
        {children}
        {isRequired && <span>*</span>}
        {displayOptionalText && <OptionalFieldText />}
      </FormLabel>
      {hint && <InfoPopover>{hint}</InfoPopover>}
    </div>
  );
};

export default FieldLabelSection;
