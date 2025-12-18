interface Props {
  title: string;
  titleContent?: string;
  description: string;
}
const PageHeader = ({ title, titleContent, description }: Props) => {
  return (
    <div className="mb-6">
      <h2 className="flex text-2xl font-bold text-balance">
        {title}
        {titleContent && (
          <p>
            :<span className="text-primary ml-2">{titleContent}</span>
          </p>
        )}
      </h2>
      <p className="text-muted-foreground font-mono text-sm font-medium">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
