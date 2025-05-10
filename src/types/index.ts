export interface NavItems {
  title: string;
  href?: string;
  description?: string;
}

export interface NavItemWithChildern extends NavItems {
  card?: NavItemWithChildern[];
  menu?: NavItemWithChildern[];
}

export type MainNavItem = NavItemWithChildern;
