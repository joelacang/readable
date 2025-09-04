import { Provider } from "@radix-ui/react-tooltip";
import type { GroupBase, StylesConfig } from "react-select";
import type { Option } from "~/types/component";

export const selectMultiStyle: StylesConfig<Option, true, GroupBase<Option>> = {
  control: (provided) => ({
    ...provided,
    borderWidth: 1,
    borderColor: "#EAD8C0",
    background: "transparent",
    fontSize: 14,
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#EAD8C0",
    gap: 4,
    borderRadius: "0.25rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    gap: 4,
    borderRadius: "0.25rem",
  }),
  option: (provided) => ({
    ...provided,
    ":hover": {
      backgroundColor: "#D1BB9E",
      color: "white",
    },
    cursor: "pointer",
    color: "",
  }),

  multiValueRemove: (provided) => ({
    ...provided,
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#796854",
  }),
};

export const selectSingleStyle: StylesConfig<
  Option,
  false,
  GroupBase<Option>
> = {
  control: (provided) => ({
    ...provided,
    borderWidth: 1,
    borderColor: "#EAD8C0",
    background: "transparent",
    fontSize: 14,
  }),
  singleValue: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    gap: 4,
    borderRadius: "0.25rem",
  }),
  option: (provided) => ({
    ...provided,
    ":hover": {
      backgroundColor: "#D1BB9E",
      color: "white",
    },
    cursor: "pointer",
    color: "",
  }),

  multiValueRemove: (provided) => ({
    ...provided,
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#796854",
  }),
};
