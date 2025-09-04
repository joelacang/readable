import Navbar from "~/features/navbar/components/navbar";
import NavbarContent from "~/features/navbar/components/navbar-content";

interface Props {
  children: React.ReactNode;
}
const PublicPageLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col">
      <Navbar>
        <NavbarContent />
      </Navbar>
      <div className="flex w-full flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default PublicPageLayout;
