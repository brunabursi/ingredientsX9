import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Alert, Image, ScrollView, Button} from 'react-native';
import ImagePicker from '../components/ImagePicker';
import recognizeText,{ type OCRObservation} from '../../jsUtils/OCRmodule';
import { matchIngredientsByName } from '../storage/utils/ingredientMatching';
import ObservationGroup from '../components/ObservationGroup';
import { IngredientsByCategory } from '../storage/utils/ingredientMatching';
import {ingredientsCategoriesStore} from '../store';

function extractWords(observations: OCRObservation[]): string[] {
  const words: string[] = [];
  observations.forEach(observation => {
    const observationWords = observation.text.split(' ');
    words.push(...observationWords);
  });
  return words;
}

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matchedObservations, setMatchedObservations] = useState<IngredientsByCategory>({});
  const {categories} = ingredientsCategoriesStore();

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
  }, [selectedImage]);

  return (
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

            <Button onPress={() => setSelectedImage(null)} title="Reset" />
          </ScrollView>
        ) : (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', marginBottom: 20}}>Select an image to analyze:</Text>
            <ImagePicker setSelectedImage={setSelectedImage} />
          </View>
        )}
    </View>
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
