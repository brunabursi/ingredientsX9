import db from '../database';
import glutenData from '../initial.json'

export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export type IngredientLookup = {
  id?: number;
  ingredientName: string;
  riskLevel?: RiskLevel;
  description?: string;
  category: string;
}

export function IngredientsLookupModel() {
  async function getAll (): Promise<IngredientLookup[]> {
    const c = await count();
    if (c === 0) {
      await seed();
    }
    try {
      const ingredients = [];
      const result = await db.executeSql('SELECT * FROM ingredients_lookup');
      for (let i = 0; i < result.rows.length; i++) {
        ingredients.push(result.rows.item(i));
      }
      return ingredients;
    }catch (error) {
      console.error('Error getting all ingredients:', error);
      return [];
    }
  }
  async function count(): Promise<number> {
    try {
      const result = await db.executeSql('SELECT COUNT(*) FROM ingredients_lookup');
      return result.rows.item(0)['COUNT(*)'];
    }catch (error) {
      console.error('Error getting count of ingredients:', error);
      return 0;
    }
  }
  async function create(item:IngredientLookup): Promise<void> {
    try {
      await db.executeSql(`
        INSERT INTO ingredients_lookup (ingredientName, riskLevel, description)
        VALUES (?, ?, ?)`,
        [item.ingredientName, item.riskLevel, item.description]
      );
    }catch (error) {
      console.error('Error creating ingredients_lookup table:', error);
    }
  }
  async function seed() {
    try {
      const c = await count();
      if (c === 0) {
        for (const item of glutenData) {
          await create({
            ingredientName: item.name,
            riskLevel: (item.riskLevel as RiskLevel),
            description: item.description,
            category: item.category
          });
        }
      }
    }catch (error) {
      console.error('Error seeding ingredients:', error);
    }
  }

  async function fetchCategories(): Promise<string[]> {
    try {
      const result = await db.executeSql('SELECT DISTINCT category FROM ingredients_lookup');
      const categories = [];
      for (let i = 0; i < result.rows.length; i++) {
        categories.push(result.rows.item(i).category);
      }
      return categories;
    }catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
  async function fetchIngredientsByCategory(category: string[]): Promise<IngredientLookup[]> {
    try {
      const result = await db.executeSql('SELECT * FROM ingredients_lookup WHERE category IN (?)', [category.join(',')]);
      const ingredients = [];
      for (let i = 0; i < result.rows.length; i++) {
        ingredients.push(result.rows.item(i));
      }
      return ingredients;
    }catch (error) {
      console.error('Error fetching ingredients by category:', error);
      return [];
    }
  }
  return {
    getAll,
    count,
    create,
    fetchCategories,
    fetchIngredientsByCategory
  };
}