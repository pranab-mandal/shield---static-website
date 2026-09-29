import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import "./App.css";
import CardNav from "./components/CardNav";

// Import Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Domains from "./pages/Domains";
import Activities from "./pages/Activities";
import Team from "./pages/Team";
import Contact from "./pages/Contact";

const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_YXdhaXRlZC1jYW1lbC00ODc2LmNsZXJrLmFjY291bnRzLmRldiQ";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const navItems = [
  {
    label: "Main",
    bgColor: "#0d1b17",
    textColor: "#fff",
    links: [
      { label: "Home", href: "/", ariaLabel: "Go to Home" },
      { label: "About", href: "/about", ariaLabel: "About Us" },
    ],
  },
  {
    label: "Explore",
    bgColor: "#10202a",
    textColor: "#fff",
    links: [
      { label: "Domains", href: "/domains", ariaLabel: "Our Domains" },
      { label: "Activities", href: "/activities", ariaLabel: "Our Activities" },
    ],
  },
  {
    label: "People",
    bgColor: "#0d1b17",
    textColor: "#fff",
    links: [
      { label: "Team", href: "/team", ariaLabel: "Our Team" },
      { label: "Contact", href: "/contact", ariaLabel: "Contact Us" },
    ],
  },
];

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <ScrollToTop />
        <div className="relative min-h-screen bg-neutral-950 flex flex-col">
          <div className="fixed top-0 w-full z-9999">
            <CardNav
              logoAlt="SHIELD"
              items={navItems}
              baseColor="#000"
              menuColor="#fff"
              buttonBgColor="#61dca3"
              buttonTextColor="#000"
              ease="power3.out"
            />
          </div>

        {/* Floating Vertical Social Bar (Right Side) */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-6 bg-[#0a0a0a]/80 border border-white/10 backdrop-blur-md px-2.5 py-8 rounded-full items-center shadow-xl">
          <a
            href="#"
            className="text-gray-400 hover:text-[#61dca3] transition-colors font-mono text-xs tracking-widest uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            GitHub
          </a>
          <div className="w-px h-8 bg-white/20"></div>
          <a
            href="#"
            className="text-gray-400 hover:text-[#61b3dc] transition-colors font-mono text-xs tracking-widest uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Discord
          </a>
          <div className="w-px h-8 bg-white/20"></div>
          <a
            href="#"
            className="text-gray-400 hover:text-[#61dca3] transition-colors font-mono text-xs tracking-widest uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Twitter
          </a>
        </div>

        <div className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>

        {/* Professional Standard Footer */}
        <footer className="w-full bg-[#050505] border-t border-white/5 pt-16 pb-8 px-6 sm:px-12 md:px-24 mt-auto relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-white text-3xl font-bold tracking-tight">
                SHIELD
              </h3>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                Society for Hacking Intelligence and Ethical Learning and
                Defense. A community of ethical hackers and security researchers
                at NIT Hamirpur.
              </p>
            </div>

            <div className="space-y-5">
              <h4 className="text-white font-semibold tracking-wider text-sm uppercase">
                Explore
              </h4>
              <div className="flex flex-col gap-3">
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
                <Link
                  to="/domains"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Domains
                </Link>
                <Link
                  to="/activities"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Activities
                </Link>
                <Link
                  to="/projects"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Projects
                </Link>
              </div>
            </div>

            <div className="space-y-5">
              <h4 className="text-white font-semibold tracking-wider text-sm uppercase">
                Connect
              </h4>
              <div className="flex flex-col gap-3">
                <Link
                  to="/team"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Our Team
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-[#61dca3] transition-colors text-sm"
                >
                  Join the Society
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} SHIELD Cyber Society. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
