interface Props {
  title: string;
  description?: string | React.ReactNode;
}

const DetailInfo = ({ title, description = "None" }: Props) => {
  return (
    <div className="w-full">
      <p className="text-muted-foreground text-sm font-semibold">{title}</p>
      {description ? (
        <>
          {typeof description === "string" ? (
            <p className="text-sm">{description}</p>
          ) : (
            <div>{description}</div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground font-light">NO INFORMATION</p>
      )}
    </div>
  );
};

export default DetailInfo;
