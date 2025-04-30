import { OCRObservation } from "../../../jsUtils/OCRmodule";
import { IngredientsLookupModel, type IngredientLookup }from "../models/ingredientsLookup";
import { matchIngredients } from "./compareStrings";
const model = IngredientsLookupModel();

export type IngredientsByCategory = {
  [category: string]: IngredientLookup[]
}

// Simple memoization cache
const memoCache = new Map<string, IngredientsByCategory>();

export async function matchIngredientsByName(ingredients: OCRObservation[], categories: string[]): Promise<IngredientsByCategory | null> {
  const ingredientsText = extractWords(ingredients);
  // Create a cache key from the normalized input
  const cacheKey = JSON.stringify({
    ingredientsText: ingredientsText.trim().toLowerCase(),
    categories: [...categories].sort()
  });

  // Check cache first
  if (memoCache.has(cacheKey)) {
    return memoCache.get(cacheKey)!;
  }

  try {
    const allIngredients = await model.fetchIngredientsByCategory(categories);
    const matches = matchIngredients(ingredientsText, allIngredients);
    const result = groupIngredientsByCategory(matches);
    console.log('[DEBUG] Matched ingredients:', result);
  
    memoCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error matching ingredient by name:', error);
    return null;
  }
}


const groupIngredientsByCategory = (ingredients: IngredientLookup[]): IngredientsByCategory => {
  const grouped: Record<string, IngredientLookup[]> = {};
  for (const ingredient of ingredients) {
    if (!grouped[ingredient.category]) {
      grouped[ingredient.category] = [];
    }
    grouped[ingredient.category].push(ingredient);
  }
  return grouped;
}

function extractWords(observations: OCRObservation[]): string {
  let words: string = '';
  observations.forEach(observation => {
    words = `${words} ${observation.text}`;
  });
  return words.trim();
}