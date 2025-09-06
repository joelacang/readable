interface Props {
  children: React.ReactNode;
}

const UserLayoutPage = ({ children }: Props) => {
  return (
    <div className="flex flex-row gap-6">
      <div className="hidden w-64 border xl:flex">
        <p>Sidebar Here</p>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default UserLayoutPage;
