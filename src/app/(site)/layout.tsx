import NavbarContent from "~/features/navbar/components/navbar-content";
import Footer from "./(public)/(landing-page)/footer";
import Navbar from "~/features/navbar/components/navbar";
import PageAuthCheck from "~/features/auth/PageAuthCheck";

interface Props {
  children: React.ReactNode;
}
const SiteLayout = ({ children }: Props) => {
  return <PageAuthCheck>{children}</PageAuthCheck>;
};

export default SiteLayout;
