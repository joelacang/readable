interface Props {
  title: string;
  description: string;
}
const PageHeader = ({ title, description }: Props) => {
  return (
    <div className="mb-6">
      <h2 className="text-primary text-2xl font-bold text-balance">{title}</h2>
      <p className="text-muted-foreground font-mono text-sm font-medium">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
