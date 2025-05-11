import MainNavigation from "@/components/Layout/MainNavigation";
import MobileNavigation from "@/components/Layout/MobileNavigation";
import { siteConfig } from "@/config/site";
import { ModeToggle } from "@/components/mode-toggle";

function Header() {
  return (
    <header className="w-full border-b">
      <nav className="container flex items-center h-16 mx-auto">
        <MainNavigation items={siteConfig.mainNav} />
        <MobileNavigation items={siteConfig.mainNav}/>
        <div className="flex flex-1 item-center justify-end space-x-4 mr-8 lg:mr-0"><ModeToggle/></div>
      </nav>
    </header>
  );
}

export default Header;
