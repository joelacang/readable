import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

interface Props {
  label: string;
  componentType: "input" | "textarea";
  placeholder?: string;
}
const FormComponent = ({ label, componentType, placeholder }: Props) => {
  return (
    <div className="w-full space-y-1">
      <p className="text-sm">{label}</p>
      {componentType === "input" && (
        <Input className="w-full" placeholder={placeholder} />
      )}
      {componentType === "textarea" && (
        <Textarea className="h-24 w-full" placeholder={placeholder} />
      )}
    </div>
  );
};

export default FormComponent;
