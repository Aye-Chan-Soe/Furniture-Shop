import MainNavigation from "@/components/Layout/MainNavigation";
import MobileNavigation from "@/components/Layout/MobileNavigation";
import { siteConfig } from "@/config/site";

function Header() {
  return (
    <header className="w-full border-b">
      <nav className="container flex items-center h-16 mx-auto">
        <MainNavigation items={siteConfig.mainNav} />
        <MobileNavigation items={siteConfig.mainNav}/>
      </nav>
    </header>
  );
}

export default Header;
