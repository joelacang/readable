import { create } from "zustand";

export type StoredImageType = {
  id: string;
  name: string;
  url: string;
};
type TempImagesState = {
  images: Record<string, File | StoredImageType> | null; // key = id
  onAdd: (id: string, image: File) => void;
  onAddImages: (images: Record<string, File>) => void;
  onAddStoredImages: (images: Record<string, StoredImageType>) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export const useTempImages = create<TempImagesState>((set) => ({
  images: null,
  onAdd: (id, image) =>
    set((state) => ({
      images: {
        ...state.images,
        [id]: image, // overwrite if same id
      },
    })),
  onAddStoredImages: (newStoredImages) =>
    set((state) => ({
      images: {
        ...state.images,
        ...newStoredImages,
      },
    })),
  onAddImages: (newImages) =>
    set((state) => ({
      images: {
        ...state.images,
        ...newImages, // merges, overwrites duplicates by key
      },
    })),
  onRemove: (id) =>
    set((state) => {
      const newImages = { ...state.images };
      delete newImages[id];
      return { images: newImages };
    }),

  onClear: () => set({ images: null }),
}));
