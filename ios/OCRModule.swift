import Foundation
import UIKit
import Vision

@objc(OCRModuleIos)
class OCRModuleIos: NSObject {
    
    @objc static func requiresMainQueueSetup() -> Bool { return true }
    
    @objc
    func recognizeTextFromBase64(_ base64String: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let imageData = Data(base64Encoded: base64String),
              let image = UIImage(data: imageData) else {
            reject("INVALID_IMAGE", "Failed to decode base64 image", nil)
            return
        }
        
        guard let cgImage = image.cgImage else {
            reject("IMAGE_ERROR", "Could not convert UIImage to CGImage", nil)
            return
        }
        
        let request = VNRecognizeTextRequest { request, error in
            if let error = error {
                reject("OCR_ERROR", "Text recognition failed", error)
                return
            }
            
            guard let observations = request.results as? [VNRecognizedTextObservation] else {
                resolve([])
                return
            }
            
            let recognizedData = observations.compactMap { observation -> [String: Any]? in
                guard let text = observation.topCandidates(1).first?.string else { return nil }
                let boundingBox = observation.boundingBox
                return [
                    "text": text,
                    "bounds": [
                        "x": boundingBox.origin.x,
                        "y": boundingBox.origin.y,
                        "width": boundingBox.size.width,
                        "height": boundingBox.size.height
                    ]
                ]
            }
            
            resolve(recognizedData)
        }
        
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        
        let requests = [request]
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])        
        
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try handler.perform(requests)
            } catch {
                reject("PROCESSING_ERROR", "Failed to perform OCR request", error)
            }
        }
    }
}
