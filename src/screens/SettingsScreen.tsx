import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';  
import { IngredientsLookupModel } from '../storage/models/ingredientsLookup';
import {ingredientsCategoriesStore} from '../store';

const model = IngredientsLookupModel();

export default function SettingsScreen() {
  const {categories, setCategories} = ingredientsCategoriesStore();
  const [availableCats, setAvailableCats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const iterableCatSet = () => {
    return new Set(categories);
  }

  const fetchCategories = async () => {
    const categories = await model.fetchCategories();
    setAvailableCats(categories);
    setLoading(false);
  }

  const isSelected = (category: string) => iterableCatSet().has(category);

  const toggleCategory = (category: string) => {
    if (isSelected(category)) {
      setCategories(categories.filter(cat => cat !== category));
    } else {
      setCategories([...categories, category]);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [])

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Available ingredient categories:</Text>
      {loading ? <Text>Loading...</Text> : (
        <View>
          {availableCats.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleCategory(cat)}
              style={isSelected(cat) ? styles.selectedCategory : styles.category}
            >
              {cat}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  category: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#f0f8ff',
    color: '#4682B4',
    padding: 8,
    borderRadius: 20,
    marginBottom: 8,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ADD8E6',
    fontSize: 14,
    textAlign: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  } 
});

