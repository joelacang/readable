import { useEffect, useState } from "react";
import type { FormIdentityType, Option } from "~/types/component";
import { fromSelectOptions, toSelectOptions } from "~/utils/get-values";

export interface DialogHookProps {
  optionCreated?: FormIdentityType | null;
  onRemoveOption: () => void;
}

interface FormSelectFieldProps {
  value: FormIdentityType[];
  onChange: (options: FormIdentityType[]) => void;
  SelectComponent: React.ComponentType<{
    selectedOptions: Option[];
    onChange: (options: Option[]) => void;
  }>;
  dialogHook: DialogHookProps;
}

const FormSelectField = ({
  value,
  onChange,
  SelectComponent,
  dialogHook,
}: FormSelectFieldProps) => {
  const { optionCreated, onRemoveOption } = dialogHook;

  //Handle creating from Dialog
  useEffect(() => {
    if (!optionCreated) return;

    const exists = value.some((item) => item.id === optionCreated.id);

    if (!exists) {
      const updated = [...value, optionCreated];
      onChange(updated);
    }

    onRemoveOption();
  }, [optionCreated, onChange, onRemoveOption, value]);

  return (
    <SelectComponent
      selectedOptions={toSelectOptions(value)}
      onChange={(options) => {
        const updated = fromSelectOptions(options);
        onChange(updated);
      }}
    />
  );
};

export default FormSelectField;
