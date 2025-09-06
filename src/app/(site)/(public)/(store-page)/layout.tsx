interface Props {
  children: React.ReactNode;
}
const StorePagesLayout = ({ children }: Props) => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="container w-full px-4 py-6">{children}</div>
    </div>
  );
};

export default StorePagesLayout;
