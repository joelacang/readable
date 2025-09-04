import Footer from "./footer";
import PopularBooks from "./popular-books";
import FeaturedBooks from "./featured-books";
import CategorySection from "./category-section";
import HeroSection from "./hero-section";

const LandingPage = () => {
  return (
    <main className="flex w-full flex-col">
      <HeroSection />
      <CategorySection />
      <FeaturedBooks />
      <PopularBooks />
      <Footer />
    </main>
  );
};

export default LandingPage;
