import { NativeModules, Platform } from 'react-native';

export type OCRObservation = {
  text: string;
  bounds: [number, number, number, number]; // [x, y, width, height]
};

type RecognizeTextFunction = (base64Image: string) => Promise<OCRObservation[]>;

const OCRModule:RecognizeTextFunction = Platform.select({
  android: NativeModules.OCRModuleAndroid,
  ios: NativeModules.OCRModuleIos
})

export default OCRModule;
