import { Icons } from "@/components/icons"
import { Link } from "react-router"
import { siteConfig } from "@/config/site"
import NewsLetterForm from "../news-letter"
function Footer() {
    return (
        <footer className="w-full border-t p-4 lg:p-0">
            <div className="container mx-auto pb-8 pt-6 lg:py-6 ">
                <section className="flex flex-col lg:justify-between lg:flex-row gap-10 lg:gap-20">
                    <section>
                        <Link to="/" className="flex items-center space-x-2">
                            <Icons.logo className="size-6" aria-hidden="true"></Icons.logo>
                            <span className="font-bold">{siteConfig.name}</span>
                            <span className="sr-only">Home</span>
                        </Link>
                    </section>
                    <section className="grid grid-cols-2  md:grid-cols-4 gap-10">
                        {siteConfig.footerNav.map((footer) => (
                            <div key={footer.title} className="space-y-3">
                                <h4 className="font-medium">{footer.title}</h4>
                                <ul className="space-y-2">
                                    {footer.items.map((item) =>
                                        <li key={item.title} className="text-sm text-foreground/70">
                                            <Link to={item.href} target={item.external ? "_blank" : "_parent"} >{item.title}
                                                <span className="sr-only">{item.title}</span>
                                            </Link></li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </section>
                    {/* <div className="xl:flex flex-1 hidden"></div> */}

                    <section className="space-y-2">
                        <h4 className="font-sm">Subscribe to our newsletter</h4>
                        <NewsLetterForm />
                    </section>
                </section>
            </div>
        </footer>
    )
}

export default Footer