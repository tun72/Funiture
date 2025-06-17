import { Link } from "react-router";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import React from "react";
import type { mainNavItem } from "@/types";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

interface MainNavigationProps {
  items?: mainNavItem[];
}
function MainNavigation({ items }: MainNavigationProps) {
  return (
    <div className="hidden gap-6 lg:flex ">
      <Link to="/" className="flex items-center space-x-2">
        <Icons.logo className="size-7" aria-hidden="true" />
        <span className="text-lg font-bold">{siteConfig.name}</span>
        <span className="sr-only">Home</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          {items?.[0]?.title && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>{items?.[0].title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                        to="/"
                      >
                        <Icons.logo className="size-8 text-black" aria-hidden="true" />

                        <div className="mt-4 mb-2 text-lg font-medium">
                          {siteConfig.name}
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          {siteConfig.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {items[0].card.map((item) => (
                    <ListItem
                      href={item.href}
                      title={item.title}
                      key={item.title}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          {items?.[0]?.menu &&
            items?.[0]?.menu.map((menu) => (
              <NavigationMenuItem key={menu.title}>

                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to={String(menu.href)}>
                    {menu.title}
                  </Link>
                </NavigationMenuLink>


              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={String(href)}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
export default MainNavigation;
