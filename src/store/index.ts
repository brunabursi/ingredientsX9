import { create } from "zustand";

type IngredientCategoryStore = {
  categories: string[];
  setCategories: (categories: string[]) => void;
};

const ingredientsCategoriesStore = create<IngredientCategoryStore>((set) => ({
  categories: [],
  setCategories: (categories) => {
    set({ categories })
  },
}));

export {ingredientsCategoriesStore}
