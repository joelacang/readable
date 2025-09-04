export enum IMAGE_SOURCE {
  BOOK,
  AUTHOR,
  CATEGORY,
  COLLECTION,
}

export function uploadImages({
  id,
  source,
  images,
}: {
  id: string;
  source: IMAGE_SOURCE;
  images: File[];
}): void {}
