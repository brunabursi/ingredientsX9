#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(OCRModuleIos, NSObject)

RCT_EXTERN_METHOD(recognizeText:(NSString *)base64Image
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end