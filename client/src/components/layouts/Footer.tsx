import { Icons } from "@/components/icons"
import { Link } from "react-router"
import { siteConfig } from "@/config/site"
function Footer() {
    return (
        <footer className="w-full border-t">
            <div className="container mx-auto">
                <section className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                    <section className="">

                        <Link to="/" className="flex items-center space-x-2">
                            <Icons.logo className="size-6" aria-hidden="true"></Icons.logo>
                            <span className="font-bold">{siteConfig.name}</span>
                            <span className="sr-only">Home</span>
                        </Link>
                    </section>
                    <section className="grid grid-cols-2  md:grid-cols-4">

                    </section>
                </section>
            </div>
        </footer>
    )
}

export default Footer