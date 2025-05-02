export interface NavItem {
  title: string;
  href?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  title: string;
  card: NavItem[];
  menu: NavItem[];
}

export type mainNavItem = NavItemWithChildren;

