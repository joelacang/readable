import { Loader2Icon } from "lucide-react";

interface Props {
  label?: string;
}
const Loading = ({ label }: Props) => {
  return (
    <div className="text-primary flex w-full flex-col items-center justify-center gap-2 py-4">
      <Loader2Icon className="!size-8 animate-spin" />
      <p className="text-sm font-semibold">{`${label ?? "Loading"}...`}</p>
    </div>
  );
};

export default Loading;
