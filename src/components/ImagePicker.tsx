import {Text, TouchableOpacity, StyleSheet, Alert, Image, Platform, PermissionsAndroid, ScrollView} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

type ImagePickerProps = {
  setSelectedImage: (image: string) => void;
};

const ImagePicker = ({setSelectedImage}:ImagePickerProps) => {
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
                  includeBase64: true, 
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
              includeBase64: true,
            }, handlePickerResponse),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    };

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
  )
    }

    const styles = StyleSheet.create({
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

    export default ImagePicker