import type { FormIdentityType, Option } from "~/types/component";
import type { DialogHookProps } from "./form-select-field";
import { useEffect } from "react";
import {
  fromSelectOption,
  toSelectOption,
  toSelectOptions,
} from "~/utils/get-values";
import { useSeriesDialog } from "~/features/series/hooks/use-series-dialog";

interface FormSelectFieldProps {
  value: FormIdentityType | null;
  onChange: (option: FormIdentityType | null) => void;
  SelectComponent: React.ComponentType<{
    selectedOption: Option | null;
    onChange: (option: Option | null) => void;
  }>;
  dialogHook: DialogHookProps;
  formId: string;
}

const FormSingleSelectField = ({
  value,
  onChange,
  SelectComponent,
  dialogHook,
  formId,
}: FormSelectFieldProps) => {
  const { optionCreated, onRemoveOption } = dialogHook;
  const { formId: createdOptionFormId } = useSeriesDialog();

  useEffect(() => {
    if (!optionCreated) return;

    if (createdOptionFormId === formId) {
      onChange(optionCreated);
    }

    onRemoveOption();
  }, [
    optionCreated,
    onChange,
    onRemoveOption,
    value,
    formId,
    createdOptionFormId,
  ]);

  return (
    <SelectComponent
      selectedOption={value ? toSelectOption(value) : null}
      onChange={(option) => {
        onChange(option ? fromSelectOption(option) : null);
      }}
    />
  );
};

export default FormSingleSelectField;
