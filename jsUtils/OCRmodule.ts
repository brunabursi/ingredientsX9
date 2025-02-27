import { NativeModules, Platform } from 'react-native';

export interface OCRObservation {
  text: string;
  bounds: [number, number, number, number]; // [x, y, width, height]
}
//TODO: find out why native modules are not being loaded
const getOCRModule = () => {
  const modules = NativeModules;
  console.log('[DEBUG] Available Native Modules:', JSON.stringify(Object.keys(modules)));
  console.log('[DEBUG] Full NativeModules object:', JSON.stringify(modules));
  
  const moduleName = Platform.select({
    ios: 'OCRModuleIos',
    android: 'OCRModuleAndroid',
  });

  console.log(`[DEBUG] Looking for OCR module: ${moduleName}`);
  
  if (!moduleName) {
    throw new Error('Unsupported platform for OCR');
  }

  const module = modules[moduleName];
  
  if (!module) {
    console.error(`[DEBUG] Module ${moduleName} not found in:`, modules);
    throw new Error(
      `OCR module not found. Ensure the native module "${moduleName}" is properly linked. ` +
      `Available modules: ${Object.keys(modules).join(', ')}`
    );
  }

  if (typeof module.recognizeText !== 'function') {
    console.error(`[DEBUG] Module methods:`, Object.keys(module));
    throw new Error(
      `OCR module found but missing recognizeText method. ` +
      `Available methods: ${Object.keys(module).join(', ')}`
    );
  }

  return module;
};

export default function recognizeText(base64Image: string): Promise<OCRObservation[]> {
  if (!base64Image) {
    throw new Error('No image data provided');
  }
  
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const module = getOCRModule();
  
  console.log('[DEBUG] Calling native OCR module recognizeText');
  return module.recognizeText(cleanBase64);
}
