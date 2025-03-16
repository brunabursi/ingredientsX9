import { create } from "zustand";
import { UserCategoriesModel } from "../storage/models/userCategories";

const {getAll, swapState} = UserCategoriesModel();

type IngredientCategoryStore = {
  categories: string[];
  setCategories: (categories: string[]) => void;
  fetch: () => void;
};

const ingredientsCategoriesStore = create<IngredientCategoryStore>((set) => ({
  categories: [],
  setCategories: async (categories) => {
    await swapState(categories);
    set({ categories })
  },
  fetch: async () => {
    const categories = await getAll();
    set({ categories });
  } 
}));

export {ingredientsCategoriesStore}
