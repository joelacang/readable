interface Props {
  title: string;
  description: string;
}
const PageHeader = ({ title, description }: Props) => {
  return (
    <div className="mb-6">
      <h2 className="text-primary text-3xl font-bold text-balance">{title}</h2>
      <p className="text-muted-foreground text-base">{description}</p>
    </div>
  );
};

export default PageHeader;
