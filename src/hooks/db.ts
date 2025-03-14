import { useState, useEffect } from "react";
import db from '../storage/database';

export function useInitializeDb() {
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const initDb = async () => {
        try {
          await db.initialize();
          setDatabaseInitialized(true);
          setError(null);
        } catch (err: any) {
          console.error('Database initialization error:', err);
          setError(err.message);
          setDatabaseInitialized(false);
        }
      };
  
      initDb();
      
      // Cleanup function to close the database when the app is closed
      return () => {
        db.close().catch(err => console.error('Error closing database:', err));
      };
    }, []);

    return { databaseInitialized, error };
}