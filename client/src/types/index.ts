export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  title: string;
  card: NavItemWithChildren[];
  menu: NavItemWithChildren[];
}

export type mainNavItem = NavItemWithChildren;
