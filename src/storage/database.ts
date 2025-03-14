import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import glutenData from './initial.json'

// Enable debugging in development
SQLite.DEBUG(true);
SQLite.enablePromise(true);

export class DatabaseInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseInitializationError';
  }
}

export class DatabaseManager {
  private database: SQLiteDatabase | null = null;
  private static instance: DatabaseManager;

  // Get singleton instance
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Initialize the database connection
   */
  public async initialize(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase({
        name: 'ingredientsX9.db',
        location: 'default',
      });
      console.log('Database initialized');
      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new DatabaseInitializationError(`Failed to initialize database: ${error}`);
    }
  }

  /**
   * Create database tables if they don't exist
   */
  private async createTables(): Promise<void> {
    if (!this.database) {
      throw new DatabaseInitializationError('Database not initialized');
    }

    // Simplified database schema for preferences and ingredient lookup
    const queries = [
      `CREATE TABLE IF NOT EXISTS ingredients_lookup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ingredientName TEXT NOT NULL,
        riskLevel TEXT,
        description TEXT,
        category TEXT
      )`
    ];

    try {
      for (const query of queries) {
        await this.database.executeSql(query);
      }
      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  /**
   * Close the database connection
   */
  public async close(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
      console.log('Database closed');
    }
  }

  /**
   * Execute a SQL query with parameters
   */
  public async executeSql(sql: string, params: any[] = []): Promise<any> {
    if (!this.database) {
      await this.initialize();
    }
    
    try {
      const [results] = await this.database!.executeSql(sql, params);
      return results;
    } catch (error) {
      console.error(`Error executing SQL: ${sql}`, error);
      throw error;
    }
  }
  
  /**
   * Get the database instance directly (use with caution)
   */
  public getDatabase(): SQLiteDatabase {
    if (!this.database) {
      throw new DatabaseInitializationError('Database not initialized');
    }
    return this.database;
  }
}

export default DatabaseManager.getInstance();
