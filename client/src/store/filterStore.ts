import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Filter {
  categories?: string;
  types?: string;
}

const initialState: Filter = {
  categories: "",
  types: "",
};

type Actions = {
  addCategories: (categories: string) => void;
  addTypes: (types: string) => void;
  getFilterLink: () => string;
  clearFilter: () => void;
};

const useFilterStore = create<Filter & Actions>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      addCategories: (categories: string) =>
        set((state) => {
          state.categories = categories?.length ? categories : "";
        }),
      addTypes: (types: string) =>
        set((state) => {
          state.types = types?.length ? types : "";
        }),

      getFilterLink: () => {
        const { categories, types } = get();
        const categoriesFilter = categories
          ? categories
              .split(",")
              .map((cat) => Number(cat))
              .filter((cat) => !isNaN(cat))
              .map((type) => type.toString())
          : [];
        const typesFilter = types
          ? types
              .split(",")
              .map((type) => Number(type))
              .filter((type) => !isNaN(type))
              .map((type) => type.toString())
          : [];
        const cat =
          categoriesFilter.length > 0 ? categoriesFilter.join(",") : null;
        const type = typesFilter.length > 0 ? typesFilter.join(",") : null;
        return `/products?${cat ? "categories=" + cat + "&" : ""}${type ? "types=" + type : ""}`;
      },
      clearFilter: () =>
        set((state) => {
          state.categories = "";
          state.types = "";
        }),
    })),
    {
      name: "filter-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useFilterStore;
