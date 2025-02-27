import Foundation
import Vision
import React

@objc(OCRModuleIos)
class OCRModuleIos: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc func recognizeText(_ base64Image: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    // Convert base64 to image
    guard let imageData = Data(base64Encoded: base64Image, options: .ignoreUnknownCharacters),
          let image = UIImage(data: imageData),
          let cgImage = image.cgImage else {
      rejecter("ERR_INVALID_IMAGE", "Could not decode image data", nil)
      return
    }
    
    // Create Vision request
    let request = VNRecognizeTextRequest { (request, error) in
      if let error = error {
        rejecter("ERR_VISION", "Text recognition failed: \(error.localizedDescription)", error)
        return
      }
      
      guard let observations = request.results as? [VNRecognizedTextObservation] else {
        resolver([])
        return
      }
      
      // Convert observations to expected format
      let results = observations.compactMap { observation -> [String: Any]? in
        guard let topCandidate = observation.topCandidates(1).first else { return nil }
        
        let boundingBox = observation.boundingBox
        // Convert to coordinate system expected by React Native
        let bounds: [CGFloat] = [
            boundingBox.origin.x,                   
            1.0 - boundingBox.origin.y - boundingBox.height,
            boundingBox.width,                      
            boundingBox.height                      
        ]
        
        return [
          "text": topCandidate.string,
          "bounds": bounds
        ]
      }
      
      resolver(results)
    }
    
    // Configure request
    request.recognitionLevel = .accurate
    
    // Process image
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
      try handler.perform([request])
    } catch {
      rejecter("ERR_VISION_REQUEST", "Failed to perform vision request: \(error.localizedDescription)", error)
    }
  }
}