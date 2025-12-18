import PageAuthCheck from "~/features/auth/PageAuthCheck";

interface Props {
  children: React.ReactNode;
}
const SiteLayout = ({ children }: Props) => {
  return <PageAuthCheck>{children}</PageAuthCheck>;
};

export default SiteLayout;
