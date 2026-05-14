import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";

export default function SiteShell({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <>
      <Navbar />
      {/* Reserve space for the fixed bottom mobile nav so the footer isn't hidden */}
      <div className="pb-[calc(70px+env(safe-area-inset-bottom))] md:pb-0">
        {children}
        <Footer />
      </div>
      <MobileBottomNav />
    </>
  );
}
