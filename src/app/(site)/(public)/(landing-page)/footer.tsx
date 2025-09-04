import { Book, Mail } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2A251F] py-16 text-[#FFF2E1]">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Book className="h-8 w-8" />
              <span className="text-2xl font-bold">BookHaven</span>
            </div>
            <p className="text-gray-300">
              Your destination for discovering amazing books across all genres.
              From bestsellers to hidden gems, we have something for every
              reader.
            </p>
            <div className="flex space-x-4">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <FaFacebookF className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <FaXTwitter className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <FaInstagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  All Books
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  New Releases
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Bestsellers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Award Winners
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Stay Updated</h3>
            <p className="mb-4 text-gray-300">
              Get the latest book recommendations and exclusive offers.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="border-white/20 bg-white/10 text-white placeholder:text-gray-400"
              />
              <Button className="bg-burgundy hover:bg-burgundy/90">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8 text-center text-gray-300">
          <p>
            &copy; 2024 BookHaven. All rights reserved. | Privacy Policy | Terms
            of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
