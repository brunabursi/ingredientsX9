import db from '../database';

type Category = {
  name: string
}

export function UserCategoriesModel() {
  async function getAll (): Promise<string[]> {
    try {
      const categories = [];
      const result = await db.executeSql('SELECT * FROM user_categories');
      for (let i = 0; i < result.rows.length; i++) {
        categories.push((result.rows.item(i) as Category).name);
      }
      return categories;
    }catch (error) {
      console.error('Error getting all user_categories:', error);
      return [];
    }
  }
  async function swapState(items:string[]): Promise<void> {
    try {
      await db.executeSql(`
       DELETE FROM user_categories`,
      );
      for (const item of items) {
        await db.executeSql(`INSERT INTO user_categories (name) VALUES (?)`, [item]);
      }
    }catch (error) {
      console.error('Error deleting user_categories content:', error);
    }
  }
  return {
    getAll,
    swapState
  };
}