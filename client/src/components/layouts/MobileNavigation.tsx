import type { mainNavItem } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icons } from "../icons";
import { Link } from "react-router";
import { siteConfig } from "@/config/site";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";


interface MainNavigationProps {
  items?: mainNavItem[];
}

function MobileNavigation({ items }: MainNavigationProps) {

  const [isDesktop, setIsDesktop] = useState(false)
  const query = "(min-width: 1024px)";

  useEffect(() => {
    const result = matchMedia(query);

    const onChange = (e: MediaQueryListEvent) => {


      setIsDesktop(e.matches)
    }
    result.addEventListener("change", onChange)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  if (isDesktop) return null
  return (


    <div className="lg:hidden">
      <Sheet>

        <SheetTrigger asChild>
          <Button variant="ghost" size={'icon'} className="ml-4 size-6 cursor-pointer">
            <Icons.hamburger aria-hidden="true" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>

        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>

        <SheetContent side={"left"} className="pt-9" aria-description="{undefinied}">
          <div className="p-4">

            <SheetClose asChild>
              <Link to="/" className="flex items-center">
                <Icons.logo className="size-5 mr-2" />
                <span className="font-bold">{siteConfig.name}</span>
                <span className="sr-only">Home</span>
              </Link>
            </SheetClose>



            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-8" >
              <Accordion type="multiple" className="w-full">
                <AccordionItem value={String(items?.[0].title)}>
                  <AccordionTrigger>{items?.[0].title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pl-2">
                      {items?.[0].card.map((item) => (
                        <SheetClose asChild key={item.title}>
                          <Link to={String(item.href)} className="text-foreground/70">{item.title}</Link>
                        </SheetClose>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex flex-col space-y-3 mt-2">
                {items?.[0].menu.map((menu) => (
                  <SheetClose asChild key={menu.title}>
                    <Link to={String(menu.href)} className="text-sm">{menu.title}</Link>
                  </SheetClose>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>

      </Sheet>
    </div>
  );
}




export default MobileNavigation;


/* */
