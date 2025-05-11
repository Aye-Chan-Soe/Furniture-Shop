import { siteConfig } from "@/config/site"
import { Link } from "react-router-dom"
import { Icons } from "@/components/icons"
import NewsLetterForm from "@/components/NewsLetter"


export default function Footer() {
  return (
    <footer className="w-full border-t ml-4 lg:ml-0">
        <div className="container mx-auto pb-8 pt-6 lg:py-6">
            <section className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                <section>
                    <Link to="/" className="items-center space-x-2 flex">
                        <Icons.logo className="size-7" aria-hidden="true" />
                        <span className="font-bold">{siteConfig.name}</span>
                        <span className="sr-only">Home</span>
                    </Link>
                </section>
               <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10"> 
                    {siteConfig.footerNav.map((foot) => (
                        <div className="space-y-3" key={foot.title}>
                            <h4 className="font-medium">{foot.title}</h4>
                            <ul className=""> 
                                {foot.items.map((item) => (
                                    <li className="py-2" key={item.title}>
                                    <Link to={item.href}
                                        target={item.external ? "_blank" : undefined}
                                        className="text-muted-foreground hover:text-foreground text-sm">{item.title}</Link>
                                    <span className="sr-only">{item.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
               </section>
               <section className="space-y-3">
                    <h4 className="font-medium">Subscribe to our newsletter</h4>
                    <NewsLetterForm />
               </section>
            </section>
        </div>
    </footer> 
  )
}
