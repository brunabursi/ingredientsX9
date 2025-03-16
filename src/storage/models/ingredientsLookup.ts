import db from '../database';

export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export type IngredientLookup = {
  id?: number;
  name: string;
  riskLevel?: RiskLevel;
  description?: string;
  category: string;
}

export function IngredientsLookupModel() {
  async function getAll (): Promise<IngredientLookup[]> {
    
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
        INSERT INTO ingredients_lookup (name, riskLevel, description, category)
        VALUES (?, ?, ?, ?)`,
        [item.name, item.riskLevel, item.description, item.category]
      );
    }catch (error) {
      console.error('Error creating ingredients_lookup table:', error);
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
      const result = await db.executeSql(`SELECT * FROM ingredients_lookup WHERE category IN (${formatCategories(category)})`, []);
      const ingredients = [];
      for (let i = 0; i < result.rows.length; i++) {
        ingredients.push(result.rows.item(i));
      }
      console.log(ingredients)
      return ingredients;
    }catch (error) {
      console.error('Error fetching ingredients by category:', error);
      return [];
    }
  }
  function formatCategories(categories: string[]): string {
    return categories.map(cat => `"${cat}"`).join(',');
  }
  return {
    getAll,
    count,
    create,
    fetchCategories,
    fetchIngredientsByCategory
  };
}