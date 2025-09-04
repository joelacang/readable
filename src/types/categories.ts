export type CategoryDetailType = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  
  
  color?: string | null;
  slug: string;
  code: string;
  parentId?: string | null;
  metaTitle?: string | null;
  metaDescription: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  subCategories: CategoryDetailType[];
};

export type CategoryOptionType = {
  id: string;
  name: string;
};
