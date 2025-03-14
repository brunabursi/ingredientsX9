import { IngredientsLookupModel, type IngredientLookup }from "../models/ingredientsLookup";
import levenshtein from 'js-levenshtein'

const model = IngredientsLookupModel();

export type IngredientsByCategory = {
  [category: string]: IngredientLookup[]
}

function compareNames(name1: string, name2: string): boolean {
  const distance = levenshtein(name1.toLowerCase(), name2.toLowerCase());
  //one possible "mistake" for every 4 characters in the name
  return distance <= Math.ceil(name1.length / 4);
}

function removeDuplicates(ingredients: string[]): string[] {
  return ingredients.filter((ingredient, index) => ingredients.indexOf(ingredient) === index);
}

export async function matchIngredientsByName(ingredientName: string[], categories:string[]): Promise<IngredientsByCategory | null> {
  try {
    const allIngredients = await model.fetchIngredientsByCategory(categories);
    console.log(allIngredients)
    const matchedIngredients: IngredientLookup[] = [];

    for (const name of removeDuplicates(ingredientName)) {
      for (const ingredient of allIngredients) {
        if (compareNames(name, ingredient.ingredientName)) {
          matchedIngredients.push(ingredient);
          break;
        }
      }
    }

    return groupIngredientsByCategory(matchedIngredients)
  } catch(error) {
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