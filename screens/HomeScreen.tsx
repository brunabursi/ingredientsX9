import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import recognizeText,{ type OCRObservation} from '../jsUtils/OCRmodule';

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [observations, setObservations] = useState<OCRObservation[]>([]);
  
  const handleChoosePhoto = () => {
    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => launchCamera({
            mediaType: 'photo',
            quality: 1,
            saveToPhotos: false,
          }, handlePickerResponse),
        },
        {
          text: 'Choose from Library',
          onPress: () => launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
          }, handlePickerResponse),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderObservationsAsText = () => {
    return observations.map((observation, index) => (
      <Text key={index}>
        {observation.text} ({observation.bounds[0]}, {observation.bounds[1]}, {observation.bounds[2]}, {observation.bounds[3]})
      </Text>
    ));
  }

  useEffect(() => {
    if (selectedImage) {
      const result = await recognizeText(selectedImage);
      setObservations(result);
    }
  }, [selectedImage]);

  const handlePickerResponse = (response: ImagePickerResponse) => {
    if (response.assets?.[0]?.base64) {
      setSelectedImage(`data:image/jpeg;base64,${response.assets[0].base64}`);
    }
  };

  if (selectedImage) {
    return (
      <View style={styles.container}>      
        <Image source={{ uri: selectedImage }} style={{ flex: 1 }} />
        <View style={styles.divider} />
        {renderObservationsAsText()}
      </View>
    )
  }

  return (
      <View style={styles.container}>
        <Text style={styles.disclaimer}>
          Take or select a picture of the list of ingredients.
        </Text>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={handleChoosePhoto}
        >
        <Text style={styles.buttonText}>Select Photo</Text>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  disclaimer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  }
});
