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

export type Product = {
  id: number;
  name: string;
  description: string;
  images: Image[];
  categoryId: string;
  price: number;
  discount: number;
  rating: number;
  inventory: number;
  status: string;
  users: [];
};

type Image = {
  id: number;
  path: string;
};

export type Tag = {
  name: string;
};
export type Post = {
  id: number;
  author: {
    fullName: string;
  };
  title: string;
  content: string;
  image: string;
  body: string;
  updated_at: string;
  tags: Tag[];
};

export type Category = {
  id: number;
  name: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  imageUrl: string;
};

export type Cart = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  // image: {
  //   id: string;
  //   name: string;
  //   url: string;
  // };
  // category: string;
  // subcategory: string;
};

export type FilterProps = {
  categories: Category[];
  types: Category[];
};
