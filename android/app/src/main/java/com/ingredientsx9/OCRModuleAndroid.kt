package com.ingredientsx9

import com.facebook.react.bridge.*
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import android.graphics.BitmapFactory
import android.util.Base64
import android.util.Log

class OCRModuleAndroid(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "OCRModuleAndroid"
    
    @ReactMethod
    fun recognizeText(base64Image: String, promise: Promise) {
        try {
            Log.d("OCRModuleAndroid", "Starting text recognition")
            
            // Decode base64 to bitmap
            val imageBytes = Base64.decode(base64Image, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            
            if (bitmap == null) {
                promise.reject("OCR_ERROR", "Failed to decode image")
                return
            }
            
            val image = InputImage.fromBitmap(bitmap, 0)
            val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            
            recognizer.process(image)
                .addOnSuccessListener { visionText ->
                    val resultArray = WritableNativeArray()
                    
                    for (block in visionText.textBlocks) {
                        for (line in block.lines) {
                            val lineObj = WritableNativeMap()
                            lineObj.putString("text", line.text)
                            
                            val bounds = WritableNativeArray()
                            bounds.pushDouble((line.boundingBox?.left?.toDouble() ?: 0.0) / bitmap.width)
                            bounds.pushDouble((line.boundingBox?.top?.toDouble() ?: 0.0) / bitmap.height)
                            bounds.pushDouble((line.boundingBox?.width()?.toDouble() ?: 0.0) / bitmap.width)
                            bounds.pushDouble((line.boundingBox?.height()?.toDouble() ?: 0.0) / bitmap.height)
                            
                            lineObj.putArray("bounds", bounds)
                            resultArray.pushMap(lineObj)
                        }
                    }
                    
                    promise.resolve(resultArray)
                }
                .addOnFailureListener { e ->
                    promise.reject("OCR_PROCESS_ERROR", e.message, e)
                }
        } catch (e: Exception) {
            promise.reject("OCR_ERROR", e.message, e)
        }
    }
}