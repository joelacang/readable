import { CardTitle } from "./ui/card";

interface Props {
  title: string;
  description?: string | React.ReactNode;
}

const DetailInfo = ({ title, description = "None" }: Props) => {
  return (
    <div className="w-full">
      <p className="text-muted-foreground text-sm font-semibold">{title}</p>
      {typeof description === "string" ? (
        <p className="text-sm">{description ?? "No Information"}</p>
      ) : (
        <div>{description}</div>
      )}
    </div>
  );
};

export default DetailInfo;
