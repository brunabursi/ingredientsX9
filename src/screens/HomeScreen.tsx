import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Alert, Image, ScrollView, Button} from 'react-native';
import ImagePicker from '../components/ImagePicker';
import recognizeText,{ type OCRObservation} from '../../jsUtils/OCRmodule';
import { matchIngredientsByName } from '../storage/utils/ingredientMatching';
import ObservationGroup from '../components/ObservationGroup';
import { IngredientsByCategory } from '../storage/utils/ingredientMatching';
import {ingredientsCategoriesStore} from '../store';
import { StackScreenProps } from '@react-navigation/stack';

function extractWords(observations: OCRObservation[]): string[] {
  const words: string[] = [];
  observations.forEach(observation => {
    words.push(...observation.text.split(' '));
  });
  return words;
}

type HomeScreenProps = StackScreenProps<any, 'X9'>;

export default function HomeScreen({navigation}: HomeScreenProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matchedObservations, setMatchedObservations] = useState<IngredientsByCategory>({});
  const {categories, fetch: fetchCategories} = ingredientsCategoriesStore();

  useEffect(() => {
    fetchCategories()
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('Settings')}
          title="Settings"
        />
      ),
    });
  }, [navigation]);

  const reset = () => {
    setSelectedImage(null);
    setMatchedObservations({});
  }

  const getMatchedCategories = (matchedItens: IngredientsByCategory) :string[] => {
    return Object.keys(matchedItens);
  }

  useEffect(() => {
    if (selectedImage) {
      (async () => {
        try {
          console.log('[DEBUG] Attempting OCR recognition...');
          const result = await recognizeText(selectedImage);
          console.log('[DEBUG] OCR result:', result);
          const matched = await matchIngredientsByName(extractWords(result), categories);
          setMatchedObservations(matched || {});
        } catch (error) {
          console.error('[DEBUG] OCR failed:', error);
          Alert.alert('OCR Error', 'Failed to process text from image');
          setMatchedObservations({});
        }
      })();
    }
  }, [selectedImage, categories]);

  return (
      categories?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No categories selected. Please select some categories in settings screen.</Text>
          <Button title='Go to settings' onPress={() => navigation.navigate('Settings')} />
        </View>
      ) : (
        <View style={styles.container}>
          {selectedImage ? (
            <ScrollView style={styles.scrollView}>
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.selectedImage}
                resizeMode="contain"
              />
              <View style={styles.divider} />
              
              {getMatchedCategories(matchedObservations).map((cat, index) => (
                <ObservationGroup category={cat} observations={matchedObservations[cat]} key={index} />
              ))}

              <Button onPress={reset} title="Reset" />
            </ScrollView>
          ) : (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{textAlign: 'center', marginBottom: 20}}>Select an image to analyze:</Text>
              <ImagePicker setSelectedImage={setSelectedImage} />
            </View>
          )}
      </View>
      )
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  }
});
