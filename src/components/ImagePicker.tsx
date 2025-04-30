import {Text, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid, View, KeyboardAvoidingView} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import ActionInput from './ActionInput';
import { useState } from 'react';
import {getSystemColors} from './colors';

type ImagePickerProps = {
  setSelectedImage: (image: string) => void;
};

const ImagePicker = ({setSelectedImage}:ImagePickerProps) => {
  const [ingredientsString, setIngredientesString] = useState<string>('');
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

    const handleImagePicker = async () => {
      const hasPermission = await requestCameraPermission();
      if (hasPermission) {
        launchImageLibrary({
          mediaType: 'photo',
          quality: 1,
          includeBase64: true,
        }, handlePickerResponse);
      }
    }

    const handleCameraLaunch = async () => {
      const hasPermission = await requestCameraPermission();
      if (hasPermission) {
        launchCamera({
          mediaType: 'photo',
          quality: 1,
          saveToPhotos: false,
          includeBase64: true, 
        }, handlePickerResponse);
      }
    }

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
    <KeyboardAvoidingView 
      style={{ flex: 1, paddingBottom: 20 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={120} // Adjust this value
    >
      <View style={styles.container}>
        <Text style={styles.disclaimer}>
          Tire ou selecione uma foto dos ingredientes, ou digite manualmente.
        </Text>


        <ActionInput
          value={ingredientsString}
          onChange={setIngredientesString}
          placeholder="Digite os ingredientes..."
          onButtonClick={handleImagePicker}
          />
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={handleCameraLaunch}
          >
          <Text style={styles.buttonText}>Tirar uma nova foto</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const colors = getSystemColors();

const styles = StyleSheet.create({
  disclaimer: {
    fontSize: 14,
    color: colors.secondaryTextColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerButton: {
    backgroundColor: colors.accentColor,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primaryTextColor,
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
});

export default ImagePicker