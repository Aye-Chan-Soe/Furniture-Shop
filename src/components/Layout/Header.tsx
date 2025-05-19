import MainNavigation from '@/components/Layout/MainNavigation'
import MobileNavigation from '@/components/Layout/MobileNavigation'
import { siteConfig } from '@/config/site'
import { ModeToggle } from '@/components/mode-toggle'
import AuthDropDown from './AuthDropDown'
import { User } from '@/data/user'

function Header() {
  return (
    <header className="bg-background fixed top-0 z-50 w-full border-b">
      <nav className="container mx-auto flex h-16 items-center">
        <MainNavigation items={siteConfig.mainNav} />
        <MobileNavigation items={siteConfig.mainNav} />
        <div className="item-center mr-8 flex flex-1 justify-end space-x-4 lg:mr-0">
          <ModeToggle />
          <AuthDropDown user={User} />
        </div>
      </nav>
    </header>
  )
}

export default Header
