import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Alert, Image, Platform, PermissionsAndroid, ScrollView} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import recognizeText,{ type OCRObservation} from '../jsUtils/OCRmodule';

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [observations, setObservations] = useState<OCRObservation[]>([]);
  
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "This app needs access to camera to take photos of ingredients lists.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS permissions are handled through Info.plist
  };

  const handleChoosePhoto = async () => {
    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (hasPermission) {
              launchCamera({
                mediaType: 'photo',
                quality: 1,
                saveToPhotos: false,
              }, handlePickerResponse);
            } else {
              Alert.alert('Permission denied', 'Camera permission is required to take photos');
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: () => launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            includeBase64: true, // Add this option
          }, handlePickerResponse),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderObservationsAsText = () => {
    return observations.map((observation, index) => (
      <Text key={index}>
        {observation.text} 
      </Text>
    ));
  }

  useEffect(() => {
    if (selectedImage) {
      (async () => {
        try {
          console.log('[DEBUG] Attempting OCR recognition...');
          const result = await recognizeText(selectedImage);
          console.log('[DEBUG] OCR result:', result);
          setObservations(result);
        } catch (error) {
          console.error('[DEBUG] OCR failed:', error);
          Alert.alert('OCR Error', 'Failed to process text from image');
          setObservations([]);
        }
      })();
    }
  }, [selectedImage]);

  const handlePickerResponse = (response: ImagePickerResponse) => {
    console.log('[DEBUG] Image picker response:', JSON.stringify(response, null, 2));
    
    if (response.didCancel) {
      console.log('[DEBUG] User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      console.error('[DEBUG] ImagePicker Error:', response.errorMessage);
      Alert.alert('Error', 'Failed to pick image');
      return;
    }

    if (response.assets?.[0]?.base64) {
      console.log('[DEBUG] Image selected successfully, base64 length:', response.assets[0].base64?.length);
      setSelectedImage(`data:image/jpeg;base64,${response.assets[0].base64}`);
    } else {
      console.error('[DEBUG] No base64 data in response');
      Alert.alert('Error', 'Failed to process image');
    }
  };

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
            {renderObservationsAsText()}
          </ScrollView>
        ) : (
          <>
            <Text style={styles.disclaimer}>
              Take or select a picture of the list of ingredients.
            </Text>

            <TouchableOpacity
              style={styles.pickerButton}
              onPress={handleChoosePhoto}
            >
              <Text style={styles.buttonText}>Select Photo</Text>
            </TouchableOpacity>
          </>
        )}
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
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
});
