import levenshtein from 'js-levenshtein'
import { IngredientLookup } from "../models/ingredientsLookup";

// Fuzzy substring search with tolerance
export function matchIngredients(largerString: string, ingredients: IngredientLookup[], tolerance?: number): IngredientLookup[] {
  const normalizedLarge = largerString.toLowerCase();
  const matches: IngredientLookup[] = [];

  for (const ingredient of ingredients) {
    const normalizedSmall = ingredient.name.toLowerCase();
    const smallLen = normalizedSmall.length;
    const maxDist = tolerance !== undefined ? tolerance : Math.max(1, Math.round(smallLen * 0.2)); // Default: 20% of length or at least 1
    
    // Check exact match
    if (normalizedLarge.includes(normalizedSmall)) {
      matches.push(ingredient);
      continue;
    }

    // Sliding window over the larger string
    for (let i = 0; i <= normalizedLarge.length - smallLen; i++) {
      const window = normalizedLarge.slice(i, i + smallLen);
      if (levenshtein(window, normalizedSmall) <= maxDist) {
        matches.push(ingredient);
        break;
      }
    }
  }
  return matches;
}

  