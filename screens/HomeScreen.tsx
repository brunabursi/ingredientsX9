import React, { useContext } from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { useLinkTo } from '@react-navigation/native';
import { ImageContext } from '../App';

export default function HomeScreen() {
  const linkTo = useLinkTo();
  const { setSelectedImage } = useContext(ImageContext);
  
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

  const handlePickerResponse = (response: ImagePickerResponse) => {
    if (response.assets?.[0]?.base64) {
      setSelectedImage(`data:image/jpeg;base64,${response.assets[0].base64}`);
      linkTo('ImageDetails');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.disclaimer}>
        Take or select a picture of the list of ingredients.
      </Text>

      {/* Image Picker Section */}
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={handleChoosePhoto}
      >
        <Text style={styles.buttonText}>Select Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  }
});
